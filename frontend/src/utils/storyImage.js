const storyImages = {
    michael:
        "https://upload.wikimedia.org/wikipedia/commons/0/02/Michael_Phelps_%282009%29.jpg",

    indra:
        "https://upload.wikimedia.org/wikipedia/commons/d/d8/Indra_Nooyi.jpg",

    satya:
        "https://upload.wikimedia.org/wikipedia/commons/8/83/MS-Exec-Nadella-Satya-2017-08-31-22.jpg",
};

const categoryImages = {
    business:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",

    job:
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80",

    investment:
        "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1200&q=80",

    other:
        "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80",
};

function getStoryImage(post) {
    if (post.image_url) {
        return post.image_url;
    }

    const title = (post.title || "").toLowerCase();

    if (
        title.includes("michael phelps") ||
        title.includes("phelps")
    ) {
        return storyImages.michael;
    }

    if (
        title.includes("indra nooyi") ||
        title.includes("nooyi")
    ) {
        return storyImages.indra;
    }

    if (
        title.includes("satya nadella") ||
        title.includes("nadella")
    ) {
        return storyImages.satya;
    }

    const category = (post.category || "").toLowerCase();

    if (category === "business") {
        return categoryImages.business;
    }

    if (category === "job" || category === "jobs") {
        return categoryImages.job;
    }

    if (category === "investment") {
        return categoryImages.investment;
    }

    return categoryImages.other;
}

export default getStoryImage;