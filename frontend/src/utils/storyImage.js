const storyImages = {
    indra:
        "https://upload.wikimedia.org/wikipedia/commons/d/d8/Indra_Nooyi.jpg",

    business:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",

    job:
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80",

    investment:
        "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1200&q=80",

    sports:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",

    other:
        "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80",
};

const categoryImages = {
    business:
        storyImages.business,

    job:
        storyImages.job,

    investment:
        storyImages.investment,

    sports:
        storyImages.sports,

    other:
        storyImages.other,
};

function getStoryImage(post) {
    if (post.image_url) {
        return post.image_url;
    }

    const title = (post.title || "").toLowerCase();


    if (
        title.includes("indra nooyi") ||
        title.includes("nooyi")
    ) {
        return storyImages.indra;
    }

    const category = (post.category || "").toLowerCase();

    if (category === "business") {
        return categoryImages.business;
    }

    if (
        category === "job" ||
        category === "jobs"
    ) {
        return categoryImages.job;
    }

    if (category === "investment") {
        return categoryImages.investment;
    }

    if (category === "sports") {
        return categoryImages.sports;
    }

    return categoryImages.other;
}

export default getStoryImage;