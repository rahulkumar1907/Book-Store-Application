function generateSlug(title) {
    // Convert the title to lowercase
    let slug = title.toLowerCase();

    // Replace spaces with hyphens
    slug = slug.replace(/\s+/g, '-');

    // Remove special characters
    slug = slug.replace(/[^\w\-]/g, '');

    return slug;
}
module.exports = { generateSlug };