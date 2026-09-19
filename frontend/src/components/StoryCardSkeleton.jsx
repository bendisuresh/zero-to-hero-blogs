import Skeleton from "./Skeleton";
import "./StoryCardSkeleton.css";

function StoryCardSkeleton() {
    return (
        <article className="story-card-skeleton">
            <Skeleton
                variant="image"
                className="story-card-skeleton-image"
            />

            <div className="story-card-skeleton-content">
                <Skeleton
                    variant="subtitle"
                    className="story-card-skeleton-category"
                />

                <Skeleton
                    variant="title"
                    className="story-card-skeleton-title"
                />

                <Skeleton
                    variant="text"
                    className="story-card-skeleton-description"
                />

                <Skeleton
                    variant="text"
                    className="story-card-skeleton-description-short"
                />

                <div className="story-card-skeleton-footer">
                    <Skeleton
                        variant="text"
                        className="story-card-skeleton-meta"
                    />

                    <Skeleton
                        variant="text"
                        className="story-card-skeleton-meta-small"
                    />
                </div>
            </div>
        </article>
    );
}

export default StoryCardSkeleton;