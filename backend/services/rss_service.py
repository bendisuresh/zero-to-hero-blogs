import os

from models import Post


def generate_rss_feed():
    posts = (
        Post.query
        .filter_by(status="published")
        .order_by(
            Post.created_at.desc()
        )
        .limit(20)
        .all()
    )

    frontend_url = os.getenv(
        "FRONTEND_URL",
        "http://127.0.0.1:5173"
    )

    rss_items = []

    for post in posts:
        rss_items.append(
            f"""
            <item>
                <title><![CDATA[{post.title}]]></title>

                <description><![CDATA[
                    {post.description}
                ]]></description>

                <link>
                    {frontend_url}/post/{post.id}
                </link>

                <guid>
                    {frontend_url}/post/{post.id}
                </guid>

                <category><![CDATA[
                    {post.category}
                ]]></category>

                <pubDate>
    {post.created_at.strftime(
        "%a, %d %b %Y %H:%M:%S GMT"
    )}
</pubDate>
            </item>
            """
        )

    rss_content = f"""<?xml version="1.0" encoding="UTF-8"?>

<rss version="2.0">

    <channel>

        <title>Zero to Hero Blogs</title>

        <description>
            Real stories of journeys from zero to success.
        </description>

        <link>
            {frontend_url}/
        </link>

        <language>en</language>

        {"".join(rss_items)}

    </channel>

</rss>
"""

    return rss_content