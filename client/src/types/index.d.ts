interface BlogDataObject {
    image: string;
    heading: string;
    content: string;
    author: {
        name: string;
        avatar: string;
    }
    createdAt: string;
    likes: number;
}

interface BlogGroupProps {
    data: BlogDataObject[];
}

interface User {
    _id: string;
    name: string;
    email: string;
    bio?: string;
    avatar?: string;
    role: string;
    socials?: [
        {
            platform: string;
            url: string;
        }
    ]
    isVerified: boolean;
    request?: string;
    isBlocked?: boolean;
    account: string[];
    googleId?: string;
    githubId?: string;
}

interface UserResponse {
    success: boolean;
    user: User;
    token: string;
}

interface AllUsersResponse {
    success: boolean;
    users: User[];
    count: number;
    resultPerPage: number;
    filteredUsersCount: number;
}

interface Blog {
    _id: string;
    title: string;
    description: string;
    content: string;
    image: string;
    isPrivate: boolean;
    likes: number;
    comments: number;
    views: number;
    category: string;
    disableComments: boolean;
    blogImages: string[];
    author: {
        _id: string;
        name: string;
        avatar?: string;
    }
    createdAt: Date;
    updatedAt: Date;
}

interface AllBlogResponse {
    success: boolean;
    blogs: Blog[];
}

interface BlogResponseById {
    success: boolean;
    blog: Blog;
}

interface Category {
    _id: string;
    name: string;
    post: string[];
    createdAt: Date;
    updatedAt: Date;
}

interface AllCategoriesResponse {
    success: boolean;
    category: Category[];
    count: number;
}

interface Comments {
    _id: string;
    comment: string;
    post: string;
    user: {
        _id: string;
        name: string;
        avatar?: string;
    }
    createdAt: Date;
    updatedAt: Date;
}

interface CommentResponse {
    success: boolean;
    comments: Comments[];
    count: number;
    resultPerPage: number;
    filteredComment: number;
}

interface Like {
    _id: string;
    post: string;
    user: {
        _id: string;
        name: string;
        avatar?: string;
    }
    createdAt: Date;
    updatedAt: Date;
}

interface LikeResponse {
    success: boolean;
    likes: Like[];
}