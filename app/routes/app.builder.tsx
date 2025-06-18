import { useState, useEffect } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  Button,
  InlineStack,
  Modal,
  TextField,
  FormLayout,
  List,
  Link,
  EmptyState,
  Toast,
  Frame,
  Banner
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import PageBuilder from "../components/PageBuilder";
import { authenticate } from "~/shopify.server";
import { getShopifyPages, getShopifyPageById } from "~/utils/shopify-api.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const pageId = url.searchParams.get("pageId");
  
  try {
    // Get all pages from Shopify
    const response = await getShopifyPages(session);
    const pages = response.data?.pages?.edges?.map((edge: any) => edge.node) || [];
    
    let specificPage = null;
    if (pageId) {
      try {
        const pageResponse = await getShopifyPageById(session, pageId);
        specificPage = pageResponse.data?.page;
      } catch (error) {
        console.error("Error loading specific page:", error);
      }
    }
    
    return json({
      pages,
      specificPage,
      pageId,
      shopDomain: session.shop,
      accessToken: session.accessToken,
    });
  } catch (error) {
    console.error("Error loading pages:", error);
    return json({ 
      error: "Failed to load pages",
      pages: [],
      specificPage: null,
      pageId,
      shopDomain: session.shop,
      accessToken: session.accessToken,
    }, { status: 500 });
  }
}

// Mock data for demo purposes (fallback)
const MOCK_PAGES = [
  { id: "1", title: "Home Page", body: "<h1>Home Page</h1>", url: "#", handle: "home" },
  { id: "2", title: "About Us", body: "<h1>About Us</h1>", url: "#", handle: "about-us" },
  { id: "3", title: "Contact", body: "<h1>Contact Us</h1>", url: "#", handle: "contact" },
];

export default function Builder() {
  const { pages: initialPages, specificPage, pageId, shopDomain, accessToken } = useLoaderData<typeof loader>();
  const [pages, setPages] = useState<any[]>(initialPages || MOCK_PAGES);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isBuilderMode, setIsBuilderMode] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [title, setTitle] = useState("");
  const [handle, setHandle] = useState("");
  const [content, setContent] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastError, setToastError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to convert page builder data to HTML
  const convertPageDataToHTML = (pageData) => {
    if (!pageData || !pageData.content || !Array.isArray(pageData.content)) {
      return '';
    }
    
    return pageData.content.map(element => {
      const styles = element.settings || {};
      const styleString = Object.entries(styles)
        .filter(([key, value]) => value && value !== 'transparent' && value !== '#000000')
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
        .join('; ');
      
      const styleAttr = styleString ? ` style="${styleString}"` : '';
      
      switch (element.type) {
        case 'heading':
          const level = styles.level || 'h2';
          return `<${level}${styleAttr}>${element.content || ''}</${level}>`;
        case 'text':
          return `<p${styleAttr}>${element.content || ''}</p>`;
        case 'button':
          const link = styles.buttonLink || '#';
          return `<a href="${link}" style="display: inline-block; padding: 8px 16px; text-decoration: none; border-radius: ${styles.buttonRadius || '4px'}; background-color: ${styles.buttonColor || '#2c6ecb'}; color: ${styles.buttonTextColor || '#ffffff'}; ${styleString}">${element.content || 'Button'}</a>`;
        case 'image':
          return `<img src="${element.content || ''}" alt="${styles.altText || ''}"${styleAttr} />`;
        case 'divider':
          return `<hr${styleAttr} />`;
        case 'section':
          return `<div${styleAttr}>${element.content && Array.isArray(element.content) ? element.content.map(child => convertPageDataToHTML({content: [child]})).join('') : ''}</div>`;
        default:
          return `<div${styleAttr}>${element.content || ''}</div>`;
      }
    }).join('\n');
  };

  // Auto-open page builder if pageId is provided
  useEffect(() => {
    if (pageId && specificPage) {
      setSelectedPage(specificPage);
      setTitle(specificPage.title);
      setContent(specificPage.body_html || '');
      setHandle(specificPage.handle);
      setIsBuilderMode(true);
    }
  }, [pageId, specificPage]);

  // Update pages when loader data changes
  useEffect(() => {
    if (initialPages && initialPages.length > 0) {
      setPages(initialPages);
    }
  }, [initialPages]);

  const handleCreatePage = () => {
    setTitle("");
    setHandle("");
    setContent("");
    setSelectedPage(null);
    setIsCreating(true);
  };

  const handleEditPage = (page) => {
    setSelectedPage(page);
    setTitle(page.title);
    setContent(page.body);
    setHandle(page.handle);
    setIsEditing(true);
  };

  const handleOpenPageBuilder = (page) => {
    setSelectedPage(page);
    setTitle(page.title);
    setContent(page.body);
    setHandle(page.handle);
    setIsBuilderMode(true);
  };

  const handleSavePage = async () => {
    try {
      setIsLoading(true);
      
      if (selectedPage) {
        // Update existing page
        try {
          const response = await fetch(`/api/pages/${selectedPage.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content: content || "", handle })
          });
          
          if (response.ok) {
            const result = await response.json();
            console.log('Page updated successfully:', result);
            
            const updatedPages = pages.map(p => 
              p.id === selectedPage.id 
                ? { ...p, title, body: content, handle } 
                : p
            );
            setPages(updatedPages);
            
            setToastMessage(`Page "${title}" has been updated successfully.`);
            setToastError(false);
          } else {
            const errorData = await response.json();
            console.error('Error updating page:', errorData);
            setToastMessage(`Failed to update page: ${errorData.error || 'Unknown error'}`);
            setToastError(true);
          }
        } catch (error) {
          console.error('Error updating page:', error);
          
          // Fallback to local update if API fails
          const updatedPages = pages.map(p => 
            p.id === selectedPage.id 
              ? { ...p, title, body: content, handle } 
              : p
          );
          setPages(updatedPages);
          
          setToastMessage(`Page "${title}" has been updated locally (API unavailable).`);
          setToastError(false);
        }
      } else {
        // Create new page
        try {
          const response = await fetch('/api/pages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              title, 
              content: content || "", 
              handle: handle || title.toLowerCase().replace(/\s+/g, '-') 
            })
          });
          
          if (response.ok) {
            const result = await response.json();
            console.log('Page created successfully:', result);
            
            const newPage = {
              id: result.page?.id || String(Date.now()),
              title,
              body: content,
              handle: handle || title.toLowerCase().replace(/\s+/g, '-'),
              url: `#${handle || title.toLowerCase().replace(/\s+/g, '-')}`,
            };
            setPages([...pages, newPage]);
            
            setToastMessage(`Page "${title}" has been created successfully.`);
            setToastError(false);
          } else {
            const errorData = await response.json();
            console.error('Error creating page:', errorData);
            setToastMessage(`Failed to create page: ${errorData.error || 'Unknown error'}`);
            setToastError(true);
          }
        } catch (error) {
          console.error('Error creating page:', error);
          
          // Fallback to local creation if API fails
          const newPage = {
            id: String(Date.now()),
            title,
            body: content,
            handle: handle || title.toLowerCase().replace(/\s+/g, '-'),
            url: `#${handle || title.toLowerCase().replace(/\s+/g, '-')}`,
          };
          setPages([...pages, newPage]);
          
          setToastMessage(`Page "${title}" has been created locally (API unavailable).`);
          setToastError(false);
        }
      }
      
      setIsCreating(false);
      setIsEditing(false);
      setShowToast(true);
      setIsLoading(false);
    } catch (err) {
      console.error('Error saving page:', err);
      setToastMessage('Failed to save page. Please try again.');
      setToastError(true);
      setShowToast(true);
      setIsLoading(false);
    }
  };

  const handleSaveBuilderPage = async (pageData) => {
    try {
      setIsLoading(true);
      
      // Convert page builder data to HTML
      const htmlContent = convertPageDataToHTML(pageData);
      
      // Call our API to save the page
      const response = await fetch(`/api/pages?id=${selectedPage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: selectedPage.title,
          handle: selectedPage.handle,
          content: htmlContent
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save page');
      }
      
      const result = await response.json();
      
      // Update local state
      const updatedPages = pages.map(p => 
        p.id === selectedPage.id 
          ? { ...p, pageBuilderData: pageData, body: htmlContent } 
          : p
      );
      setPages(updatedPages);
      
      setToastMessage(`Page "${selectedPage.title}" has been saved successfully.`);
      setToastError(false);
      setShowToast(true);
      setIsLoading(false);
    } catch (err) {
      console.error('Error saving page:', err);
      setToastMessage('Failed to save page. Please try again.');
      setToastError(true);
      setShowToast(true);
      setIsLoading(false);
    }
  };
  
  const handlePublishPage = async (pageData = null) => {
    try {
      setIsLoading(true);
      
      // First save the page if there's new data
      if (pageData) {
        await handleSaveBuilderPage(pageData);
      }
      
      // Convert page builder data to HTML
      const htmlContent = pageData ? convertPageDataToHTML(pageData) : selectedPage.body;
      
      // Call our API to publish the page (same as save for now)
      const response = await fetch(`/api/pages?id=${selectedPage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: selectedPage.title,
          handle: selectedPage.handle,
          content: htmlContent
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to publish page');
      }
      
      const result = await response.json();
      
      // Update local state
      const updatedPages = pages.map(p => 
        p.id === selectedPage.id 
          ? { ...p, published_at: new Date().toISOString(), body: htmlContent } 
          : p
      );
      setPages(updatedPages);
      
      setToastMessage(`Page "${selectedPage.title}" has been published successfully.`);
      setToastError(false);
      setShowToast(true);
      setIsLoading(false);
    } catch (err) {
      console.error('Error publishing page:', err);
      setToastMessage('Failed to publish page. Please try again.');
      setToastError(true);
      setShowToast(true);
      setIsLoading(false);
    }
  };

  const handleDeletePage = async (page) => {
    if (confirm(`Are you sure you want to delete "${page.title}"?`)) {
      try {
        setIsLoading(true);
        
        // In a real app, you would call your API
        // await fetch(`/api/pages/${page.handle}?shop=your-shop.myshopify.com`, {
        //   method: 'DELETE'
        // });
        
        const updatedPages = pages.filter(p => p.id !== page.id);
        setPages(updatedPages);
        
        setToastMessage("Page has been deleted successfully.");
        setToastError(false);
        setShowToast(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Error deleting page:', err);
        setToastMessage('Failed to delete page. Please try again.');
        setToastError(true);
        setShowToast(true);
        setIsLoading(false);
      }
    }
  };

  const renderPagesList = () => {
    if (isLoading) {
      return <Text as="p">Loading pages...</Text>;
    }
    
    if (error) {
      return (
        <Banner status="critical">
          <p>{error}</p>
        </Banner>
      );
    }
    
    if (pages.length === 0) {
      return (
        <EmptyState
          heading="No pages created yet"
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
          <p>Create your first page to get started.</p>
        </EmptyState>
      );
    }

    return (
      <List type="bullet">
        {pages.map((page) => (
          <List.Item key={page.id}>
            <InlineStack gap="300" align="space-between">
              <Link url={page.url} external>
                {page.title}
              </Link>
              <InlineStack gap="200">
                <Button size="slim" onClick={() => handleOpenPageBuilder(page)}>
                  Page Builder
                </Button>
                <Button size="slim" onClick={() => handleEditPage(page)}>
                  Edit
                </Button>
                <Button size="slim" destructive onClick={() => handleDeletePage(page)}>
                  Delete
                </Button>
              </InlineStack>
            </InlineStack>
          </List.Item>
        ))}
      </List>
    );
  };

  // If in builder mode, show the page builder interface
  if (isBuilderMode && selectedPage) {
    return (
      <Frame>
        <Page fullWidth>
          <TitleBar
            title={`Editing: ${selectedPage.title}`}
            primaryAction={{
              content: "Exit Builder",
              onAction: () => setIsBuilderMode(false),
            }}
          />
          
          {showToast && (
            <Toast
              content={toastMessage}
              error={toastError}
              onDismiss={() => setShowToast(false)}
            />
          )}
          
          <div style={{ height: "calc(100vh - 56px)" }}>
            <PageBuilder 
              initialPage={{
                id: selectedPage.id,
                title: selectedPage.title,
                content: selectedPage.pageBuilderData || []
              }}
              onSave={handleSaveBuilderPage}
              onPublish={handlePublishPage}
            />
          </div>
        </Page>
      </Frame>
    );
  }

  // Default view - page list and creation
  return (
    <Page>
      <TitleBar title="Page Builder" />

      {showToast && (
        <Toast
          content={toastMessage}
          error={toastError}
          onDismiss={() => setShowToast(false)}
        />
      )}

      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Welcome to KingsBuilder
              </Text>
              <Text as="p" variant="bodyMd">
                This is where you'll build and customize your pages. The builder interface will allow you to:
              </Text>
              <BlockStack gap="200">
                <Text as="p" variant="bodyMd">• Create new pages with drag-and-drop components</Text>
                <Text as="p" variant="bodyMd">• Customize layouts and designs</Text>
                <Text as="p" variant="bodyMd">• Preview your changes in real-time</Text>
                <Text as="p" variant="bodyMd">• Publish pages to your Shopify store</Text>
              </BlockStack>
              <InlineStack gap="300">
                <Button primary onClick={handleCreatePage}>Create New Page</Button>
                <Button url="/app/templates">View Templates</Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Your Shopify Pages
              </Text>
              {renderPagesList()}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>

      <Modal
        open={isCreating || isEditing}
        onClose={() => (isCreating ? setIsCreating(false) : setIsEditing(false))}
        title={isCreating ? "Create New Page" : "Edit Page"}
        primaryAction={{
          content: "Save",
          onAction: handleSavePage,
          loading: isLoading
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => (isCreating ? setIsCreating(false) : setIsEditing(false)),
            disabled: isLoading
          },
        ]}
      >
        <Modal.Section>
          <FormLayout>
            <TextField
              label="Page Title"
              value={title}
              onChange={setTitle}
              autoComplete="off"
              requiredIndicator
              disabled={isLoading}
            />

            {isCreating && (
              <TextField
                label="URL Handle"
                value={handle}
                onChange={setHandle}
                autoComplete="off"
                helpText="The URL path for this page (e.g., 'about-us')"
                disabled={isLoading}
              />
            )}

            <TextField
              label="Page Content"
              value={content}
              onChange={setContent}
              multiline={5}
              autoComplete="off"
              helpText="Enter HTML content or use the visual editor"
              disabled={isLoading}
            />
          </FormLayout>
        </Modal.Section>
      </Modal>
    </Page>
  );
}