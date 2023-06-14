# Serverless workshop

This project is a simplified Sytac budget management service implemented using AWS serverless.

It consists of CRUD APIs exposed by API Gateway and secured and access controlled by AWS Cognito (OAuth 2.0 implementation).
We are using two types of OAuth 2.0 grant types:

-   Authorization code grant type - for the users of Sytac web portal
-   Client credentials grant type - for the finance app

The web portal user needs to signup in order to create/access budgets.

The finance app is represented by `event-bridge-handlers#processBudget` function:

-   approves budget lower/equal than `€20`
-   declines budget higher than `€300`
-   pending for manual approval

It sends an email notification to the owner of the budget after the budget has been processed.

[Architecture diagram](https://viewer.diagrams.net/?tags=%7B%7D&highlight=0000ff&edit=_blank&layers=1&nav=1&title=sytac-budgets-architecture-diagram.drawio#R7V1bc6M4Fv41rtp9cIo7%2BDH40jNT3bs9k%2FT27Lx0ySDbdAA5GCfx%2FPqRQMIgYRvHGHA3uZSNJATinPPp09GRGKjj4O1DBNarT8iF%2FkCR3LeBOhkoiiKZGv4gKTuaoqhymrKMPDdNyyU8eH9DmijR1K3nwk2hYIyQH3vrYqKDwhA6cSENRBF6LRZbIL941TVYQiHhwQG%2BmPrVc%2BNVmmop5j79F%2BgtV%2BzKsjFKcwLACtOWbFbARa%2B5JHU6UMcRQnH6LXgbQ588PfZc0vNmB3KzG4tgGFc54fHJWX8P%2F3qeQVWbb52%2FgpfgeUib8QL8LW3wwgtB6MAhWK%2BHju%2BRytPbj3fsmWyeYOyQxkkD1V4jL4yTh6zb%2BA%2Ffwzj913HRMUm5U%2FSSxLI0U0yUxWL4Qy67Ap9YlmaKibJYjByxuy4mlqWZunjH%2FNlyydkydzb%2BU220jX0vhONMnckzXqAwHiMfRcnzV%2FHvjMjYXkbAJRLK5c10zdRGubyJF%2BGKPBTi%2FBBFRCnthef7uXPGpqzKWG3sTRyhJ5jLWSQ%2FOMcFmxV06e28wCj2sIl8BHPof0Ybj1Y%2FR3GMglyBe99bkowYrXEqoEcOviuIL2Cv4sDHxzJtITV%2BWWHHVONIPtis08ex8N7IfdjYmtYkM3hbEuS5A68b7S6CG7SNHPirQ%2B7Hxofpt2IpBy1DL0a4gGhC1KpIA%2BBbLoma1AeIAhhHO1yE5UoWtW%2BKcDKz99c9XJhWmrTKIQVLAxSgllnVexvGX6gZn2HSqioYLHQxptFDogJoiULgT%2FepdoS2oZsJeF%2FmIyKiS0TwHcbxjsoIbJPnlxMgfoLR7k96fnLwf3KAVZ4eTt7ymZNd%2FugzjDzceKIUSeJBuaTiPdJ41m3EIFrC%2BEhBUooUJI%2FmqJwj6IPYeyl2B2VCS069jyKwyxWg6Liv%2BTNJ2KuPpo4K2mOaHIifKK%2FrI05h0jvYq0%2FWlAs0yhJ6Caxj0hD%2Ff%2F7vw%2BOAaPxsvsVPMm2qoHsJUBT1RQADHjMCz3VT1YQb728wT%2BoTO5xJqbocNQzBuDP2QK9S6KDLjB7Du2RoBUHQus%2FTFkG8crFSrXg%2BWiw2MBYAog4Jaz1mVMAMvRuYwfU45ugEZvDl6R1dFzNGAmZ8mPJQMRuYNq7FnHQZNbS6UGMo3cmqptQCFBkmN4ANeo8NFbDB7AY2cPzAUs%2FjE7KkNkAomBHkwGEy%2FTh9nN4iPug14oNpaUUGMJRrgQv2wJmU5VFj6GH06FEBPYxuoAfHFCz5PGZhmWYD4MHG6MeYRXfhwqgRLgxVrYdOMJ%2FF9fGAmUROelRoQ7D2BMH1rsZCWqdcjSNNn8yU81yN%2Br0q2fpP42rEKv1tCWL4SkCwDnejwo%2FljJa9jVlf2Gz%2F%2FubFf%2Ba%2B53p3fLTv3MnBLnfAd%2B1d4QlsZusUT2DoWR9PuEj4stgVP%2Bxi4BB9hHPyMLBsgd%2Bj%2Bg2hej%2BBdBLVAzT3EhyrAdC1juG5bLU7XiPqnIfi9wAx6x1YZbSDYJ1F9e7hAkTXqiK63C1EZ96MPaLjSyVTPVhqKxThUVBirGS44sIBCdsAyUgi3mFzakF1srCKprpgraLA9sM0SWbTQ8yrQ71yVx7OGxy2nBjNHy9eHMzvT25gyMg88Hud3BCWMdxuYDRcI9QTjJ5gVCMYKY%2Fg2UVGO7pCMPYRKps1cLxw%2BZiAIWmZz7Uou9X6uYjediSL1nIky93lVOT9HZKiVOyQFKtuBvGuzsYccZEpxpHu4x1dw%2Fr%2B2X74Mpotv%2F7HVdXR%2FdeXKB6Kk8waZSu%2FhrhzSHjJirCU1MdIqothUKpVjbiHK3t9K3iSU%2Bs4xjs0mdE5Fn37HtaxlzRjL41NPWti4NFAMfyYwL33UpCh8bwlgbS2k3YN96SZy%2Fm%2FLNKRKRL7%2BHciCYlg93ABAs%2FfpUXx%2BSAgXQOt5TcY2xHwQqzv0icUIj4%2FrS7AOQSg06GgkeUZS%2FKpU018gKFLzPMlCaWV7C%2BTD9PHb39Mf%2F8yfXj8Nv5jev84nbBm4ceUtCytog34awCxtOvMlQuQxILjsnAqiZvmSO%2BUnlW%2F%2BrIHklNfJ4IgzgNST1xvh7ia1lTSziOuE0kfy%2BZP4xnzQTB3AaOpGH5cGLE2hyiEWQ5wnpYJVHG5NbDYjLZ2hsZ2KrhSaXhugwVNtsBjL5vYEj1hGLvdHrp76P6xofsKEGxYSssQ3KkYVrNpCDZuFIJZrJQAwSA5%2BVC0V4%2FEPRL3SFyKxBZbN9AaErccD1z06coNA7F5o0AsLhN3oQ97R0aPwT0Gn43BssT8kK0FbZb51XsDvhkD1iYmzjzPgPGPZo86a8BSzQbs7kIQIHdejwmbfGxM22F6utQGjcoU5LKJIq0qDdJGnaJBmkiD2KzefNsPQ28JQWczbWbZ5yGoPZZV3egsgtZNgRLVnkdeYntXjTviCZLa9oyN%2FjNvocNA9yQ6690KXdbFMNHbCRbJ9tP58ph3bOYWwFeOD%2BnGOle9ts12hmS3HS64bFjTdjtmsVZZKdZwvcgmoxX%2BliGMfCMI0y3%2BZ7CeTVwcsUioHm47dKJuL0BnmlfHLliqKV1luwq2R%2Bg1Aw5L40nNH6Tf5wym1Ezz1mc4%2Fmry%2B28T5cmUzefv%2F5vbj78MrxSUN7IKwpXZWhhWRQofQlDeufHIh65zcPULv4%2FjmeWHNW%2BcU6qfot%2BOizINUewtMICka7TaAqF3hjkfNskjGKToVhEt6oEgbi1EtvK6gaBnMah9HSEHbjaDfrblFl0N%2FWxLq7MtrTsTWiEV72fnegk%2FKC%2BodIqd652K8Wp4SFVZaLUvvbhMZmKEF1vAJSw3X0HnqT1Kc9rhweKFa9knVLdqXbnFsLHIacymKA3Tzn7Tr5tnM%2F2mX81v%2BpUF7XWG0rS7SUy73ktGe24tiI%2Fddw6Et2u3X414o0DcDysbHVbyGNz%2BHLXoJjo13TnPVl0OuZlPhbBXMkuZ%2F0LnP7szSSq%2BmmqYzbdUmh7t8azDeNbvO3gKz6iyfwtACJZ1Bd%2FwO8q2Ti6VdoNv2iWXlXeMr7wN3cVTsdy2PiNO7gf20Dh3uk64ThMvtlLEkCHlRt1PyuXxNpe%2BkkbhYnSu8Y6J8olquVQwXfCwH55YrzIBL7U1gCy%2FHXEAaQyKexwFwBM3Y2zFSI4qSl0%2B2nqDX64ahXZMEftlQDdKmX%2B8IPa6lwFt8IDzKuP%2FIeO%2FDdDko53DMeMtVbBri7dEWuod2aq3xB%2BlTNSJWqLc9e0GJbyft0xwbDVV3YIrDWgSQbffzfiGMbjfzfh6uxmX8DQBDCoHAjWJ2KWG3058Sr3vQjgdWFx%2FwDAvkAMBwodP5D1b9W%2F%2FWSrvw86F1HlNvkTQxd884BO%2FeAdfpfAeeWehuZJkce89YO%2Fuu%2B5W1Dr%2FUlM6ojqoKMfLH3rzATtbO%2BBAPVtfVc5jckA%2F63n3Aj6MEJle2RcnkP0JuWSgPv0H)

![Diagram](misc/sytac-budgets-architecture-diagram.png)

## Requirements

-   Package manager: yarn (https://classic.yarnpkg.com/lang/en/docs/install)
-   Node version manager: nvm (https://github.com/nvm-sh/nvm#installing-and-updating)
-   NodeJS 18 - `nvm install 18`

## Installation

### Install Nodejs version 18

First time using Node? Then follow this link:
https://nodejs.org/en/download

If you are familiar with Node ecosystem, you might prefer installing Node 18 using Node version manager:
https://github.com/nvm-sh/nvm

### Install yarn

I prefer using `yarn` as a package manager, but feel free to skip this step if you prefer to use `npm`.

```shell
npm install --global yarn
```

### Install AWS CLI

https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

For mac users:

```shell
brew install awscli
```

Configuring AWS CLI will be done during the workshop, so skip this step for now:

```shell
aws configure --profile sytac-workshop
```

### Install project dependencies

```shell
yarn
```

## Deployment

Since this application will be deployed by the workshop attendees, we will deploy the same application in different environments,
without interfering each other deployment and functionality. To do so, we need to change the stage property in both serverless
config files, `serverless-infra.ts` and `serverless-functions.ts`, for example you can set your name:

```
const serverlessConfiguration: AWS = {
    ...,
    provider: {
        ...
        stage: 'aldo',
        ...
    },
    ...
}
```

Also in order to receive budget notification email, you need to put your email in `serverless-infra.ts`:

```
BudgetNotificationEmailSubscription: {
    Type: 'AWS::SNS::Subscription',
    DependsOn: ['BudgetNotificationSns'],
    Properties: {
        Protocol: 'email',
        Endpoint: 'aldo@example.com',
        TopicArn: { Ref: 'BudgetNotificationSns' },
    },
}
```

Deployment can take around 5 minutes.

```shell
# deploy infra resources
yarn deploy:infra

# deploy functions
yarn deploy:functions
```

After `infra` stack has been deployed you should have received an email `AWS Notification - Subscription Confirmation`,
then you should confirm the subscription in order to receive email notifications.

Before starting to consume the APIs, you must store `finance-app` client secrets in the secrets manager
with name `${self:provider.stage}-finance-app-client-secrets` and containing this structure:

```json
{
    "id": "{client_id}",
    "secret": "{client_secret}"
}
```

## Test

Import `misc/postman/sytac-budgets-api-collection.json` in Postman.

## Cleanup

Deleting the deployed application resources, should be done in the reverse order of deployment.

```shell
# delete functions
yarn remove:functions

# delete infra resources
yarn remove:infra
```

As a last step delete the `${self:provider.stage}-finance-app-client-secrets` in secrets manager.
