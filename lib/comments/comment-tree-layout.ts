export type CommentTreeId = string | number;

export interface CommentTreeItem<TNode extends CommentTreeItem<TNode, TId>, TId extends CommentTreeId = CommentTreeId> {
  readonly id: TId;
  readonly replies: readonly TNode[];
}

export interface CommentTreeNodeMetadata<TNode, TId extends CommentTreeId> {
  readonly node: TNode;
  readonly id: TId;
  readonly parent: TNode | null;
  readonly parentId: TId | null;
  readonly logicalDepth: number;
  readonly visualDepth: number;
  readonly segmentIndex: number | null;
}

export interface CommentTreeLayoutNode<TNode, TId extends CommentTreeId>
  extends CommentTreeNodeMetadata<TNode, TId> {
  readonly children: readonly CommentTreeLayoutNode<TNode, TId>[];
  readonly descendantCount: number;
  readonly hiddenDescendantCount: number;
  readonly isCollapsed: boolean;
}

export interface CommentTreeVisualGroup<TNode, TId extends CommentTreeId> {
  readonly item: CommentTreeLayoutNode<TNode, TId>;
  readonly children: readonly CommentTreeVisualGroup<TNode, TId>[];
}

export interface CommentTreeSegment<TNode, TId extends CommentTreeId> {
  readonly key: string;
  readonly rootId: TId;
  readonly boundaryParentId: TId | null;
  readonly segmentIndex: number;
  readonly logicalDepthStart: number;
  readonly groups: readonly CommentTreeVisualGroup<TNode, TId>[];
  readonly isContinuation: boolean;
}

export interface CommentTreeRootLayout<TNode, TId extends CommentTreeId> {
  readonly root: CommentTreeLayoutNode<TNode, TId>;
  readonly segments: readonly CommentTreeSegment<TNode, TId>[];
}

export interface CommentTreeLayout<TNode, TId extends CommentTreeId> {
  readonly roots: readonly CommentTreeRootLayout<TNode, TId>[];
  readonly hiddenCount: number;
  readonly maxVisualDepth: number;
}

export interface BuildCommentTreeLayoutOptions<TId extends CommentTreeId> {
  readonly collapsedIds?: ReadonlySet<TId>;
  readonly maxVisualDepth?: number;
}

interface MutableLayoutNode<TNode, TId extends CommentTreeId>
  extends CommentTreeNodeMetadata<TNode, TId> {
  children: MutableLayoutNode<TNode, TId>[];
  descendantCount: number;
  hiddenDescendantCount: number;
  isCollapsed: boolean;
}

interface PendingSegment<TNode, TId extends CommentTreeId> {
  readonly boundaryParentId: TId | null;
  readonly roots: readonly MutableLayoutNode<TNode, TId>[];
}

const encodeKeyPart = (value: CommentTreeId | null): string =>
  value === null ? "root" : `${typeof value}:${String(value)}`;

const createLogicalNode = <TNode extends CommentTreeItem<TNode, TId>, TId extends CommentTreeId>(
  node: TNode,
  parent: TNode | null,
  logicalDepth: number,
  maxVisualDepth: number,
  collapsedIds: ReadonlySet<TId>,
): MutableLayoutNode<TNode, TId> => {
  const segmentIndex = logicalDepth === 0 ? null : Math.floor((logicalDepth - 1) / maxVisualDepth);
  const visualDepth = logicalDepth === 0 ? 0 : ((logicalDepth - 1) % maxVisualDepth) + 1;
  const children = node.replies.map((child) =>
    createLogicalNode(child, node, logicalDepth + 1, maxVisualDepth, collapsedIds),
  );
  const descendantCount = children.reduce(
    (total, child) => total + 1 + child.descendantCount,
    0,
  );

  return {
    node,
    id: node.id,
    parent,
    parentId: parent?.id ?? null,
    logicalDepth,
    visualDepth,
    segmentIndex,
    children,
    descendantCount,
    hiddenDescendantCount: collapsedIds.has(node.id) ? descendantCount : 0,
    isCollapsed: collapsedIds.has(node.id),
  };
};

const buildVisualGroup = <TNode, TId extends CommentTreeId>(
  item: MutableLayoutNode<TNode, TId>,
  pendingSegments: PendingSegment<TNode, TId>[],
  maxVisualDepth: number,
): CommentTreeVisualGroup<TNode, TId> => {
  if (item.isCollapsed || item.children.length === 0) {
    return { item, children: [] };
  }

  const visualChildren = item.children.slice().reverse();
  if (item.visualDepth >= maxVisualDepth) {
    pendingSegments.push({ boundaryParentId: item.id, roots: visualChildren });
    return { item, children: [] };
  }

  return {
    item,
    children: visualChildren.map((child) => buildVisualGroup(child, pendingSegments, maxVisualDepth)),
  };
};

const buildRootLayout = <TNode, TId extends CommentTreeId>(
  root: MutableLayoutNode<TNode, TId>,
  maxVisualDepth: number,
): CommentTreeRootLayout<TNode, TId> => {
  if (root.isCollapsed || root.children.length === 0) {
    return { root, segments: [] };
  }

  const pendingSegments: PendingSegment<TNode, TId>[] = [
    { boundaryParentId: root.id, roots: root.children.slice().reverse() },
  ];
  const segments: CommentTreeSegment<TNode, TId>[] = [];

  for (let cursor = 0; cursor < pendingSegments.length; cursor += 1) {
    const pending = pendingSegments[cursor];
    if (pending.roots.length === 0) continue;

    const groups = pending.roots.map((item) =>
      buildVisualGroup(item, pendingSegments, maxVisualDepth),
    );
    const first = pending.roots[0];
    const segmentIndex = first.segmentIndex ?? 0;

    segments.push({
      key: `${encodeKeyPart(root.id)}:${segmentIndex}:${encodeKeyPart(pending.boundaryParentId)}:${encodeKeyPart(first.id)}`,
      rootId: root.id,
      boundaryParentId: pending.boundaryParentId,
      segmentIndex,
      logicalDepthStart: first.logicalDepth,
      groups,
      isContinuation: segmentIndex > 0,
    });
  }

  return { root, segments };
};

export const buildCommentTreeLayout = <
  TNode extends CommentTreeItem<TNode, TId>,
  TId extends CommentTreeId = TNode["id"],
>(
  comments: readonly TNode[],
  options: BuildCommentTreeLayoutOptions<TId> = {},
): CommentTreeLayout<TNode, TId> => {
  const maxVisualDepth = options.maxVisualDepth ?? 5;
  if (!Number.isInteger(maxVisualDepth) || maxVisualDepth < 1) {
    throw new RangeError("maxVisualDepth must be a positive integer.");
  }

  const collapsedIds = options.collapsedIds ?? new Set<TId>();
  const logicalRoots = comments.map((comment) =>
    createLogicalNode(comment, null, 0, maxVisualDepth, collapsedIds),
  );
  const roots = logicalRoots.map((root) => buildRootLayout(root, maxVisualDepth));
  const hiddenCount = logicalRoots.reduce(
    (total, root) => total + countHiddenNodes(root, false),
    0,
  );

  return { roots, hiddenCount, maxVisualDepth };
};

const countHiddenNodes = <TNode, TId extends CommentTreeId>(
  node: MutableLayoutNode<TNode, TId>,
  hiddenByAncestor: boolean,
): number => {
  if (hiddenByAncestor) return 1 + node.descendantCount;
  if (node.isCollapsed) return node.hiddenDescendantCount;
  return node.children.reduce((total, child) => total + countHiddenNodes(child, false), 0);
};
