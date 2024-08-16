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
    avatar?: string;
    role: string;
    isVerified: boolean;
    isBlocked?: boolean;
    account: string[];
    googleId?: string;
    githubId?: string;
}

interface UserResponse {
    success: boolean;
    user: User;
}

interface AllUsersResponse {
    success: boolean;
    users: User[];
}

interface Blog {
    _id: string;
    title: string;
    description: string;
    content: string;
    image: string;
    isPrivate: boolean;
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