const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');

const resolvers = {
    Query: {
        posts: (_, args, ctx, info) => {
            return ctx.prisma.query.posts(
                {
                    where: {
                        OR: [
                            { title_contains: args.searchString },
                            { content_contains: args.searchString },
                        ],
                    },
                },
                info,
            )
        },
        user: (_, args, ctx, info) => {
            return ctx.prisma.query.user(
                {
                    where: {
                        id: args.id
                    },
                },
                info,
            )
        },
    },
    Mutation: {
        createDraft: (_, args, ctx, info) => {
            return ctx.prisma.mutation.createPost(
                {
                    data: {
                        title: args.title,
                        content: args.content,
                        author: {
                            id: args.authorId,
                        },
                    },
                },
                info,
            )
        },
        publish: (_, args, ctx, info) => {
            return ctx.prisma.mutation.updatePost(
                {
                    where: {
                        id: args.id,
                    },
                    data: {
                        published: true,
                    },
                },
                info,
            )
        },
        deletePost: (_, args, ctx, info) => {
            return ctx.prisma.mutation.deletePost(
                {
                    where: {
                        id: args.id,
                    },
                },
                info,
            )
        },
        signup: (_, args, ctx, info) => {
            return ctx.prisma.mutation.createUser(
                {
                    data: {
                        name: args.name,
                        email: args.email,
                        password: args.password
                    },
                },
                info,
            )
        }
    }
}

const server = new GraphQLServer({
    typeDefs: 'src/schema.graphql',
    resolvers,
    context: req => ({
        ...req,
        prisma: new Prisma({
            typeDefs: 'src/hello-world/generated/prisma.graphql',
            endpoint: 'http://localhost:4466'
        })
    })
})

server.start(() => console.log(`GraphQL server is running on http://localhost:4000`))
