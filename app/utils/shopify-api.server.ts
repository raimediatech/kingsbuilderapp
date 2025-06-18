import shopify from "../shopify.server";
import { GraphqlClient } from "@shopify/shopify-api/lib/clients/graphql/graphql_client";

/**
 * Creates a new page in Shopify
 */
export async function createShopifyPage(session: any, pageData: any) {
  const client = new GraphqlClient({
    session,
    apiVersion: shopify.apiVersion,
  });

  try {
    const response = await client.query({
      data: {
        query: `
          mutation pageCreate($input: PageInput!) {
            pageCreate(input: $input) {
              page {
                id
                title
                handle
                body
                bodySummary
                createdAt
                updatedAt
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          input: {
            title: pageData.title,
            body: typeof pageData.content === 'string' ? pageData.content : JSON.stringify(pageData.content),
            handle: pageData.handle,
          },
        },
      },
    });

    console.log("Shopify API Response:", response.body);
    
    // Check for user errors
    if (response.body.data && response.body.data.pageCreate && response.body.data.pageCreate.userErrors && response.body.data.pageCreate.userErrors.length > 0) {
      const userErrors = response.body.data.pageCreate.userErrors;
      console.error("Shopify user errors:", userErrors);
      throw new Error(`Shopify API Error: ${userErrors.map(e => e.message).join(', ')}`);
    }
    
    return response.body;
  } catch (error) {
    console.error("Error creating Shopify page:", error);
    throw error;
  }
}

/**
 * Updates an existing page in Shopify
 */
export async function updateShopifyPage(session: any, pageId: string, pageData: any) {
  const client = new GraphqlClient({
    session,
    apiVersion: shopify.apiVersion,
  });

  try {
    const response = await client.query({
      data: {
        query: `
          mutation pageUpdate($input: PageInput!) {
            pageUpdate(input: $input) {
              page {
                id
                title
                handle
                body
                bodySummary
                createdAt
                updatedAt
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          input: {
            id: pageId,
            title: pageData.title,
            body: typeof pageData.content === 'string' ? pageData.content : JSON.stringify(pageData.content),
            handle: pageData.handle,
          },
        },
      },
    });

    console.log("Shopify API Response:", response.body);
    
    // Check for user errors
    if (response.body.data && response.body.data.pageUpdate && response.body.data.pageUpdate.userErrors && response.body.data.pageUpdate.userErrors.length > 0) {
      const userErrors = response.body.data.pageUpdate.userErrors;
      console.error("Shopify user errors:", userErrors);
      throw new Error(`Shopify API Error: ${userErrors.map(e => e.message).join(', ')}`);
    }
    
    return response.body;
  } catch (error) {
    console.error("Error updating Shopify page:", error);
    throw error;
  }
}

/**
 * Gets a list of pages from Shopify
 */
export async function getShopifyPages(session: any) {
  const client = new GraphqlClient({
    session,
    apiVersion: shopify.apiVersion,
  });

  try {
    const response = await client.query({
      data: {
        query: `
          query {
            pages(first: 50) {
              edges {
                node {
                  id
                  title
                  handle
                  bodySummary
                  createdAt
                  updatedAt
                }
              }
            }
          }
        `,
      },
    });

    return response.body;
  } catch (error) {
    console.error("Error fetching Shopify pages:", error);
    throw error;
  }
}

/**
 * Gets a single page from Shopify by ID
 */
export async function getShopifyPageById(session: any, pageId: string) {
  const client = new GraphqlClient({
    session,
    apiVersion: shopify.apiVersion,
  });

  try {
    const response = await client.query({
      data: {
        query: `
          query getPage($id: ID!) {
            page(id: $id) {
              id
              title
              handle
              body
              bodySummary
              createdAt
              updatedAt
            }
          }
        `,
        variables: {
          id: pageId,
        },
      },
    });

    return response.body;
  } catch (error) {
    console.error("Error fetching Shopify page:", error);
    throw error;
  }
}

/**
 * Deletes a page from Shopify
 */
export async function deleteShopifyPage(session: any, pageId: string) {
  const client = new GraphqlClient({
    session,
    apiVersion: shopify.apiVersion,
  });

  try {
    const response = await client.query({
      data: {
        query: `
          mutation pageDelete($id: ID!) {
            pageDelete(id: $id) {
              deletedPageId
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          id: pageId,
        },
      },
    });

    return response.body;
  } catch (error) {
    console.error("Error deleting Shopify page:", error);
    throw error;
  }
}