# CCI Github client demo By Francois Rossouw

NB - This project is hosted for your convenience:  
[https://hayvn-shop-demo.web.app/](https://hayvn-shop-demo.web.app/)

## Installation

After cloning the project you would need to install all the project dependencies with the package manager of your choice. This can be done with the following command

```bash
npm i
```

After all the dependencies have been downloaded, you should now be able to serve this angular project and run it locally with

```bash
ng s
```

## Design Choices

I have decided to implement NgRx in this project ( even though it is probably overkill for a project of this size ) - as we talked about NgRx in one of our previous interviews and I thought that whoever goes over this code would appreciate to see an example of my implementation of it.

I have also decided to use virtual scrolling on the /products page - as this is a optimization I often use when dealing with big lists that need rendering - and thought it appropriate as the assignment stated that the store is expected to have > 5000 products.

The search term the user is searching with is also being persisted within state. This ensures that the user does not need to re-enter their search term as they navigate between pages.

I have decided to use a resolvers both my list view as well as details view page. I have done this - as this allows me to implement a pattern that I have found quite useful from previous experience. The resolver's job in this case is to look in the store, if the information required to render the page is already in store - then the components can render without issue. If the information required is not already in the store, then the resolver will fetch that information.

The benefit to doing this is that you are able to reduce the number of api calls that the client has to make. This also covers the use case of deep linking (I.e. should I user visit the details page without having gone through the list page).

## Sale Items

I am using mock api calls to retrieve both the items that are on sale as well as to retrieve images of the items.
The mock responses are stored in /src/app/core/mocks. Feel free to edit / test both images.json and sale.json - just stick with the field names already present in those files.

## Hosted

I have also taken the liberty of hosting this project for your convenience - please also feel free to check out [https://hayvn-shop-demo.web.app/](https://hayvn-shop-demo.web.app/)
