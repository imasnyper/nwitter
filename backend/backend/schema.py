import graphene

import profiles.schema
import tweets.schema


class Query(tweets.schema.Query, profiles.schema.Query, graphene.ObjectType):
    pass

class Mutation(tweets.schema.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
