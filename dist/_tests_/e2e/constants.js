"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constants = void 0;
exports.constants = {
    createBlog1: {
        name: "blogTest1",
        description: "blogTest1 description",
        websiteUrl: "https://blogTest1.com",
    },
    createBlog2: {
        name: "blogTest2",
        description: "blogTest2 description",
        websiteUrl: "https://blogTest2.com",
    },
    createBlog3: {
        name: "blogTest3",
        description: "blogTest3 description",
        websiteUrl: "https://blogTest3.com",
    },
    createPost1: {
        title: "postTest1",
        shortDescription: "postTest1 description",
        content: "cool postTest1 content",
    },
    createPost2: {
        title: "postTest2",
        shortDescription: "postTest2 description",
        content: "cool postTest2 content",
    },
    createPost3: {
        title: "postTest3",
        shortDescription: "postTest3 description",
        content: "cool postTest3 content",
    },
    variables: {
        setBlogId: "any",
        setBlogId2: "any",
        setBlogId3: "any",
        setPostId: "any",
        setPostId2: "any",
        setPostId3: "any",
    },
    mappedPosts(post) {
        return [
            {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [post],
            },
        ];
    },
};
