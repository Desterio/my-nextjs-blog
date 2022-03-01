import {useRouter} from 'next/router';
import {Article} from '@components/Article';
import {Post} from '../index';
import {GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType} from 'next';

export default function BlogPost({post}: InferGetStaticPropsType<typeof getStaticProps>) {
    const router = useRouter();

    return (
        <Article>
            <h1>{post.title}</h1>
            <p>
                {post.body}
            </p>
        </Article>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts`);
    const posts: Post[] = await res.json();

    const paths = posts.map(post => ({
        params: {id: post.id.toString()},
    }));

    return {
      paths,
      fallback: false
    };
};

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
    const {params} = context;

    const emptyPost: Post = {
        title: "Post not found",
        body: "",
        id: 0,
        userId: 0,
    };

    if (!params?.id) {
        return {
            props: {
                post: emptyPost
            }
        }
    }

    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`);

    const post: Post = await res.json();

    return {
        props: {
            post
        }
    };
}