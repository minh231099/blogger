import { Link } from "@remix-run/react";
import BlogCoverImage from '~/assets/image/blog-cover.jpeg';
import { ContentElm } from "./PostContent";

export type Post = {
    id: number;
    title: string;
    viewed: number;
    content: string;
    author: {
        id: number;
        name: string;
    }
}

type BlogCardProps = {
    post: Post;
}

const getNeareastImageURL = (content: ContentElm[]) => {
    const image = content.find((item) => item.type === 'img');
    return image?.url;
}

const countValueInContent = (content: ContentElm[]) => {
    let cnt = 0;
    content.forEach(value => {
        if (value.type == 'p') {
            value.children.forEach(valueC => {
                cnt += valueC.text.split(' ').length;
            })
        }
    });
    return Math.floor(cnt / 200);
}

const TopViewBlogCard = (props: BlogCardProps) => {
    const { post } = props;
    const content = JSON.parse(post.content);
    const coverUrl = getNeareastImageURL(content);
    return (
        <Link to={`/blog/${convertPostTitle(post.title)}-${post.id}`}>
            <div className="flex flex-col h-full border p-4 rounded-lg">
                <img className="w-full h-48 object-cover rounded-lg mb-4" src={coverUrl ? coverUrl : BlogCoverImage} alt="Blog Cover" />
                <div className="flex flex-col justify-between flex-grow">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">about {countValueInContent(content)}m read</p>
                        <h2 className="text-lg font-bold mb-1 line-clamp-2">{post.title}</h2>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-sm text-gray-500">Author: {post.author.name}</p>
                        <p className="text-sm text-gray-500">{post.viewed} {post.viewed > 1 ? 'views' : 'view'}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}

const convertPostTitle = (title: string) => {
    return title.replace(/\s+/g, '-');
}

export default TopViewBlogCard;
