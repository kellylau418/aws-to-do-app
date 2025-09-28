import { type ClientSchema, a, defineData } from "@aws-amplify/backend";


const schema = a.schema({

  Todo: a //define Todo model
    .model({ 
      content: a.string(),  //model has field called content (string)
      isDone: a.boolean(),
    })
    .authorization(allow => [allow.owner()]),
    //define owner-based authorization in Todo model
        
});

export type Schema = ClientSchema<typeof schema>; //generates typescript type "Schema" for the schema above

export const data = defineData({ //define data config for app
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool", //tells data client (from generateClient()) to sign api requests with user authentication token
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: { //configure api key
      expiresInDays: 30,
    },
  
  },
});

