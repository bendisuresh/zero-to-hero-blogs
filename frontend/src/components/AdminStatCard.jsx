function AdminStatCard({
    title,
    value,
    description,
}) {
    return (
        <article className="admin-stat-card">
            <div className="admin-stat-card-content">
                <p className="admin-stat-card-title">
                    {title}
                </p>

                <h3 className="admin-stat-card-value">
                    {value}
                </h3>

                {description && (
                    <p className="admin-stat-card-description">
                        {description}
                    </p>
                )}
            </div>
        </article>
    );
}

export default AdminStatCard;