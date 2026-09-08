import type { ReactNode } from "react";

import {
  buildCommentTreeLayout,
  type CommentTreeId,
  type CommentTreeItem,
  type CommentTreeLayoutNode,
  type CommentTreeSegment,
  type CommentTreeVisualGroup,
} from "@/lib/comments/comment-tree-layout";

export type SegmentedCommentTreeVariant = "manga" | "reader";

export interface SegmentedCommentRenderContext<TNode, TId extends CommentTreeId> {
  readonly layoutNode: CommentTreeLayoutNode<TNode, TId>;
  readonly parent: TNode | null;
  readonly parentId: TId | null;
  readonly logicalDepth: number;
  readonly visualDepth: number;
  readonly segmentIndex: number | null;
  readonly isRoot: boolean;
  readonly isCollapsed: boolean;
  readonly descendantCount: number;
  readonly hiddenCount: number;
  readonly hasReplies: boolean;
  readonly setCollapsed: (collapsed: boolean) => void;
  readonly toggleCollapsed: () => void;
}

export interface SegmentedCommentTreeProps<
  TNode extends CommentTreeItem<TNode, TId>,
  TId extends CommentTreeId = TNode["id"],
> {
  readonly comments: readonly TNode[];
  readonly collapsedIds: ReadonlySet<TId>;
  readonly onCollapsedIdsChange: (collapsedIds: ReadonlySet<TId>) => void;
  readonly renderComment: (
    comment: TNode,
    context: SegmentedCommentRenderContext<TNode, TId>,
  ) => ReactNode;
  readonly className?: string;
  readonly classPrefix?: string;
  readonly variant?: SegmentedCommentTreeVariant;
  readonly maxVisualDepth?: number;
}

const joinClasses = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(" ");

const dataId = (id: CommentTreeId | null): string | undefined =>
  id === null ? undefined : String(id);

const repliesLabel = (count: number): string => {
  const mod100 = count % 100;
  const mod10 = count % 10;
  if (mod100 >= 11 && mod100 <= 14) return "ответов";
  if (mod10 === 1) return "ответ";
  if (mod10 >= 2 && mod10 <= 4) return "ответа";
  return "ответов";
};

interface RenderShared<TNode, TId extends CommentTreeId> {
  readonly collapsedIds: ReadonlySet<TId>;
  readonly onCollapsedIdsChange: (collapsedIds: ReadonlySet<TId>) => void;
  readonly renderComment: (
    comment: TNode,
    context: SegmentedCommentRenderContext<TNode, TId>,
  ) => ReactNode;
  readonly classPrefix: string;
}

const renderGroup = <TNode, TId extends CommentTreeId>(
  group: CommentTreeVisualGroup<TNode, TId>,
  shared: RenderShared<TNode, TId>,
): ReactNode => {
  const { item } = group;
  const setCollapsed = (collapsed: boolean): void => {
    const next = new Set(shared.collapsedIds);
    if (collapsed) next.add(item.id);
    else next.delete(item.id);
    shared.onCollapsedIdsChange(next);
  };
  const context: SegmentedCommentRenderContext<TNode, TId> = {
    layoutNode: item,
    parent: item.parent,
    parentId: item.parentId,
    logicalDepth: item.logicalDepth,
    visualDepth: item.visualDepth,
    segmentIndex: item.segmentIndex,
    isRoot: false,
    isCollapsed: item.isCollapsed,
    descendantCount: item.descendantCount,
    hiddenCount: item.hiddenDescendantCount,
    hasReplies: item.children.length > 0,
    setCollapsed,
    toggleCollapsed: () => setCollapsed(!item.isCollapsed),
  };

  return (
    <div
      key={item.id}
      className={`${shared.classPrefix}__group segmented-comment-tree__group`}
      data-comment-id={dataId(item.id)}
      data-parent-id={dataId(item.parentId)}
      data-logical-depth={item.logicalDepth}
      data-visual-depth={item.visualDepth}
      data-segment-index={item.segmentIndex ?? undefined}
      data-collapsed={item.isCollapsed || undefined}
      data-hidden-count={item.hiddenDescendantCount || undefined}
    >
      <div className={`${shared.classPrefix}__card segmented-comment-tree__card`}>
        {shared.renderComment(item.node, context)}
      </div>
      {item.children.length > 0 && item.isCollapsed && (
        <button
          type="button"
          className={`${shared.classPrefix}__expand segmented-comment-tree__expand`}
          onClick={() => setCollapsed(false)}
        >
          Показать {item.hiddenDescendantCount} {repliesLabel(item.hiddenDescendantCount)}
        </button>
      )}
      {group.children.length > 0 && (
        <div className={`${shared.classPrefix}__children segmented-comment-tree__children`}>
          <button
            type="button"
            className={`${shared.classPrefix}__collapse segmented-comment-tree__collapse`}
            aria-label="Свернуть ветку"
            title="Свернуть ветку"
            onClick={() => setCollapsed(true)}
          />
          {group.children.map((child) => renderGroup(child, shared))}
        </div>
      )}
    </div>
  );
};

const renderSegment = <TNode, TId extends CommentTreeId>(
  segment: CommentTreeSegment<TNode, TId>,
  shared: RenderShared<TNode, TId>,
): ReactNode => (
  <div
    key={segment.key}
    className={joinClasses(
      `${shared.classPrefix}__segment`,
      "segmented-comment-tree__segment",
      segment.isContinuation && `${shared.classPrefix}__segment--continuation`,
      segment.isContinuation && "segmented-comment-tree__segment--continuation",
    )}
    data-root-id={dataId(segment.rootId)}
    data-boundary-parent-id={dataId(segment.boundaryParentId)}
    data-segment-index={segment.segmentIndex}
    data-logical-depth-start={segment.logicalDepthStart}
    data-continuation={segment.isContinuation || undefined}
  >
    {segment.groups.map((group) => renderGroup(group, shared))}
  </div>
);

export const SegmentedCommentTree = <
  TNode extends CommentTreeItem<TNode, TId>,
  TId extends CommentTreeId = TNode["id"],
>({
  comments,
  collapsedIds,
  onCollapsedIdsChange,
  renderComment,
  className,
  classPrefix,
  variant,
  maxVisualDepth = 5,
}: SegmentedCommentTreeProps<TNode, TId>): ReactNode => {
  const prefix = classPrefix ?? (variant ? `segmented-comment-tree--${variant}` : "segmented-comment-tree");
  const layout = buildCommentTreeLayout<TNode, TId>(comments, {
    collapsedIds,
    maxVisualDepth,
  });
  const shared: RenderShared<TNode, TId> = {
    collapsedIds,
    onCollapsedIdsChange,
    renderComment,
    classPrefix: prefix,
  };

  return (
    <div
      className={joinClasses(
        "segmented-comment-tree",
        variant && `segmented-comment-tree--${variant}`,
        prefix !== "segmented-comment-tree" && prefix,
        className,
      )}
      data-comment-tree
      data-variant={variant}
      data-max-visual-depth={layout.maxVisualDepth}
      data-hidden-count={layout.hiddenCount}
    >
      {layout.roots.map(({ root, segments }) => {
        const setCollapsed = (collapsed: boolean): void => {
          const next = new Set(collapsedIds);
          if (collapsed) next.add(root.id);
          else next.delete(root.id);
          onCollapsedIdsChange(next);
        };
        const context: SegmentedCommentRenderContext<TNode, TId> = {
          layoutNode: root,
          parent: null,
          parentId: null,
          logicalDepth: 0,
          visualDepth: 0,
          segmentIndex: null,
          isRoot: true,
          isCollapsed: root.isCollapsed,
          descendantCount: root.descendantCount,
          hiddenCount: root.hiddenDescendantCount,
          hasReplies: root.children.length > 0,
          setCollapsed,
          toggleCollapsed: () => setCollapsed(!root.isCollapsed),
        };

        return (
          <div
            key={root.id}
            className={`${prefix}__root segmented-comment-tree__root`}
            data-comment-id={dataId(root.id)}
            data-logical-depth="0"
            data-visual-depth="0"
            data-collapsed={root.isCollapsed || undefined}
            data-hidden-count={root.hiddenDescendantCount || undefined}
          >
            <div className={`${prefix}__root-card segmented-comment-tree__root-card`}>
              {renderComment(root.node, context)}
            </div>
            {root.children.length > 0 && root.isCollapsed && (
              <button
                type="button"
                className={`${prefix}__expand segmented-comment-tree__expand`}
                onClick={() => setCollapsed(false)}
              >
                Показать {root.hiddenDescendantCount} {repliesLabel(root.hiddenDescendantCount)}
              </button>
            )}
            {segments.length > 0 && (
              <div
                className={`${prefix}__root-rail segmented-comment-tree__root-rail`}
                data-root-id={dataId(root.id)}
              >
                <button
                  type="button"
                  className={`${prefix}__collapse segmented-comment-tree__collapse`}
                  aria-label="Свернуть ветку"
                  title="Свернуть ветку"
                  onClick={() => setCollapsed(true)}
                />
                {segments.map((segment) => renderSegment(segment, shared))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
