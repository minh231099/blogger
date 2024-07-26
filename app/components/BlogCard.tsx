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

const getNeareastPTag = (content: ContentElm[]) => {
    return content.find((item) => item.type === 'p');
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

const BlogCard = (props: BlogCardProps) => {
    const { post } = props;
    const content = JSON.parse(post.content);
    const coverUrl = getNeareastImageURL(content);
    return (
        <div className="my-2">
            <Link to={`/blog/${convertPostTitle(post.title)}-${post.id}`}>
                <div className="flex flex-col sm:flex-row w-full border p-4 rounded-sm hover:shadow-lg transition-shadow duration-300">
                    <img className="w-full sm:w-48 h-48 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-4" src={coverUrl ? coverUrl : BlogCoverImage} alt="Blog Cover" />
                    <div className="flex flex-col justify-between w-full">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">about {countValueInContent(content)}m read</p>
                            <h2 className="text-xl font-bold mb-1">{post.title}</h2>
                            <p className="text-gray-700 line-clamp-2 mb-4">
                                {getNeareastPTag(content)?.children?.[0].text}
                            </p>
                        </div>
                        <p className="text-sm text-gray-500">Author: {post.author.name}</p>
                    </div>
                </div>
            </Link>
        </div>
    )
}

const convertPostTitle = (title: string) => {
    return title.replace(/\s+/g, '-');
}

export default BlogCard;
