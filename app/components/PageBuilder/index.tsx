import React, { useState, useEffect, useRef } from "react";
import { 
  BlockStack, 
  Button, 
  Card, 
  Icon, 
  InlineStack, 
  Text, 
  TextField, 
  Tabs,
  Toast
} from "@shopify/polaris";
import { 
  TextMajor,
  ImageMajor,
  ButtonMinor,
  SectionMajor,
  DividerMajor,
  DesktopMajor,
  TabletMajor,
  MobileMajor,
  ProductsMajor,
  CollectionsMajor,
  PlayMajor,
  CodeMajor,
  FormsMajor,
  SocialMajor
} from "@shopify/polaris-icons";
import "./PageBuilder.css";

// Simple PageBuilder component
export default function PageBuilder({ initialPage = null, onSave, onPublish }) {
  const [viewMode, setViewMode] = useState("desktop");
  const [activeTab, setActiveTab] = useState(0);
  const [pageElements, setPageElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastError, setToastError] = useState(false);
  const dropZoneRef = useRef(null);
  
  // Initialize with any existing content
  useEffect(() => {
    if (initialPage && initialPage.content && Array.isArray(initialPage.content)) {
      setPageElements(initialPage.content);
    }
  }, [initialPage]);

  // Handle drag start
  const handleDragStart = (e, widget) => {
    e.dataTransfer.setData("widget", JSON.stringify(widget));
    e.dataTransfer.effectAllowed = "copy";
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add("drag-over");
    }
  };

  // Handle drag leave
  const handleDragLeave = (e) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("drag-over");
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("drag-over");
    }
    
    try {
      const widgetDataString = e.dataTransfer.getData("widget");
      if (!widgetDataString) {
        console.warn("No widget data found in drop event");
        return;
      }
      
      const widgetData = JSON.parse(widgetDataString);
      if (widgetData && widgetData.type) {
        const newElement = {
          id: `element-${Date.now()}`,
          type: widgetData.type,
          content: getDefaultContent(widgetData.type),
          settings: getDefaultSettings(widgetData.type)
        };
        
        setPageElements(prevElements => [...prevElements, newElement]);
        setToastMessage(`Added ${widgetData.title || widgetData.type} element`);
        setToastError(false);
        setShowToast(true);
      } else {
        console.warn("Invalid widget data:", widgetData);
        setToastMessage("Invalid widget data");
        setToastError(true);
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error dropping element:", error);
      setToastMessage(`Error adding element: ${error.message}`);
      setToastError(true);
      setShowToast(true);
    }
  };

  // Get default content based on element type
  const getDefaultContent = (type) => {
    switch (type) {
      case "heading":
        return "New Heading";
      case "text":
        return "Add your text here";
      case "button":
        return "Click Me";
      case "image":
        return "https://via.placeholder.com/400x200";
      case "divider":
        return null;
      case "section":
        return [];
      case "shopify-product":
        return {
          productId: "",
          displayMode: "single",
          showPrice: true,
          showTitle: true,
          showImage: true
        };
      case "shopify-collection":
        return {
          collectionId: "",
          displayMode: "single",
          showTitle: true,
          showImage: true,
          showProductCount: true
        };
      case "video":
        return {
          videoType: "youtube",
          videoId: "",
          videoUrl: "",
          autoplay: false,
          loop: false,
          muted: false,
          controls: true,
          title: "Video",
          width: "100%",
          height: "400px"
        };
      case "custom-code":
        return {
          htmlContent: "<div>Custom HTML content</div>",
          cssContent: "/* Custom CSS styles */",
          jsContent: "// Custom JavaScript code",
          height: "auto",
          width: "100%"
        };
      case "form-builder":
        return {
          title: "Contact Form",
          description: "Please fill out the form below to get in touch with us.",
          fields: [
            {
              id: "name",
              type: "text",
              label: "Name",
              placeholder: "Your name",
              required: true
            },
            {
              id: "email",
              type: "email",
              label: "Email",
              placeholder: "Your email address",
              required: true
            },
            {
              id: "message",
              type: "textarea",
              label: "Message",
              placeholder: "Your message",
              required: true
            }
          ],
          submitButtonText: "Submit",
          successMessage: "Thank you for your submission!",
          errorMessage: "There was an error submitting the form. Please try again.",
          storeInShopify: true
        };
      case "social-media":
        return {
          platform: "facebook",
          contentType: "post",
          id: "",
          username: "",
          showHeader: true,
          showFooter: true,
          width: "100%",
          height: "500px",
          theme: "light"
        };
      default:
        return "";
    }
  };

  // Get default settings based on element type
  const getDefaultSettings = (type) => {
    const commonSettings = {
      marginTop: "0",
      marginBottom: "20px",
      marginLeft: "0",
      marginRight: "0",
      paddingTop: "0",
      paddingBottom: "0",
      paddingLeft: "0",
      paddingRight: "0",
      backgroundColor: "transparent",
      textColor: "#000000"
    };
    
    switch (type) {
      case "heading":
        return {
          ...commonSettings,
          level: "h2",
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "left"
        };
      case "text":
        return {
          ...commonSettings,
          fontSize: "16px",
          fontWeight: "normal",
          textAlign: "left"
        };
      case "button":
        return {
          ...commonSettings,
          buttonStyle: "primary",
          buttonSize: "medium",
          buttonRadius: "4px",
          buttonColor: "#2c6ecb",
          buttonTextColor: "#ffffff",
          buttonLink: "#"
        };
      case "image":
        return {
          ...commonSettings,
          altText: "Image",
          width: "100%",
          height: "auto",
          borderRadius: "0"
        };
      case "divider":
        return {
          ...commonSettings,
          dividerStyle: "solid",
          dividerColor: "#e1e3e5",
          dividerThickness: "1px"
        };
      case "section":
        return {
          ...commonSettings,
          width: "100%",
          maxWidth: "1200px",
          minHeight: "100px"
        };
      case "shopify-product":
        return {
          ...commonSettings,
          displayMode: "single",
          showPrice: true,
          showTitle: true,
          showImage: true,
          maxProducts: 4,
          gridColumns: 2
        };
      case "shopify-collection":
        return {
          ...commonSettings,
          displayMode: "single",
          showTitle: true,
          showImage: true,
          showProductCount: true,
          maxCollections: 4,
          gridColumns: 2
        };
      case "video":
        return {
          ...commonSettings,
          autoplay: false,
          loop: false,
          muted: false,
          controls: true,
          width: "100%",
          height: "400px",
          borderRadius: "0"
        };
      case "custom-code":
        return {
          ...commonSettings,
          width: "100%",
          height: "auto",
          minHeight: "50px",
          border: "1px solid #e1e3e5",
          borderRadius: "4px"
        };
      case "form-builder":
        return {
          ...commonSettings,
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #e1e3e5"
        };
      case "social-media":
        return {
          ...commonSettings,
          width: "100%",
          height: "500px",
          borderRadius: "4px",
          border: "1px solid #e1e3e5"
        };
      default:
        return commonSettings;
    }
  };

  // Handle element selection
  const handleElementSelect = (element) => {
    setSelectedElement(element);
  };

  // Handle element deletion
  const handleElementDelete = (elementId) => {
    setPageElements(pageElements.filter(el => el.id !== elementId));
    if (selectedElement && selectedElement.id === elementId) {
      setSelectedElement(null);
    }
    setToastMessage("Element deleted");
    setToastError(false);
    setShowToast(true);
  };

  // Handle element update
  const handleElementUpdate = (elementId, field, value) => {
    const updatedElements = pageElements.map(el => {
      if (el.id === elementId) {
        if (field.startsWith("settings.")) {
          const settingField = field.replace("settings.", "");
          return {
            ...el,
            settings: {
              ...el.settings,
              [settingField]: value
            }
          };
        } else if (field.startsWith("content.")) {
          const contentField = field.replace("content.", "");
          return {
            ...el,
            content: {
              ...(typeof el.content === 'object' ? el.content : {}),
              [contentField]: value
            }
          };
        } else {
          return {
            ...el,
            [field]: value
          };
        }
      }
      return el;
    });
    
    setPageElements(updatedElements);
    
    // Update selected element if it's the one being edited
    if (selectedElement && selectedElement.id === elementId) {
      const updatedElement = updatedElements.find(el => el.id === elementId);
      setSelectedElement(updatedElement);
    }
  };

  // Handle save
  const handleSave = async () => {
    try {
      setToastMessage("Saving page...");
      setToastError(false);
      setShowToast(true);
      
      // Prepare page data
      const pageData = {
        content: pageElements,
        settings: {
          viewMode
        }
      };
      
      // Call onSave callback if provided
      if (onSave && typeof onSave === 'function') {
        await onSave(pageData);
        
        // Show success message
        setToastMessage("Page saved successfully");
        setToastError(false);
        setShowToast(true);
      } else {
        // No save callback provided, just show a message
        setToastMessage("No save handler configured");
        setToastError(true);
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error saving page:", error);
      setToastMessage(`Error saving page: ${error.message || 'Unknown error'}`);
      setToastError(true);
      setShowToast(true);
    }
  };
  
  // Render the toolbar
  const renderToolbar = () => {
    return (
      <div className="page-builder-toolbar">
        <InlineStack gap="200" align="space-between">
          <InlineStack gap="200">
            <Button
              icon={DesktopMajor}
              pressed={viewMode === "desktop"}
              onClick={() => setViewMode("desktop")}
              accessibilityLabel="Desktop view"
            />
            <Button
              icon={TabletMajor}
              pressed={viewMode === "tablet"}
              onClick={() => setViewMode("tablet")}
              accessibilityLabel="Tablet view"
            />
            <Button
              icon={MobileMajor}
              pressed={viewMode === "mobile"}
              onClick={() => setViewMode("mobile")}
              accessibilityLabel="Mobile view"
            />
          </InlineStack>
          
          <InlineStack gap="200">
            <Button onClick={handleSave}>
              Save
            </Button>
            <Button primary onClick={async () => {
              try {
                const pageData = {
                  content: pageElements,
                  settings: {
                    viewMode
                  }
                };
                
                // If there's an onPublish prop, call it
                if (typeof onPublish === 'function') {
                  await onPublish(pageData);
                  setToastMessage("Page published successfully");
                  setToastError(false);
                  setShowToast(true);
                } else {
                  // Fallback to just saving
                  await handleSave();
                }
              } catch (error) {
                console.error('Error publishing page:', error);
                setToastMessage('Error publishing page. Please try again.');
                setToastError(true);
                setShowToast(true);
              }
            }}>
              Publish
            </Button>
          </InlineStack>
        </InlineStack>
      </div>
    );
  };
  
  // Render the widget panel
  const renderWidgetPanel = () => {
    const basicWidgets = [
      { type: "heading", title: "Heading", icon: TextMajor, category: "basic" },
      { type: "text", title: "Text", icon: TextMajor, category: "basic" },
      { type: "button", title: "Button", icon: ButtonMinor, category: "basic" },
      { type: "image", title: "Image", icon: ImageMajor, category: "basic" },
      { type: "divider", title: "Divider", icon: DividerMajor, category: "basic" },
      { type: "section", title: "Section", icon: SectionMajor, category: "basic" },
    ];
    
    const advancedWidgets = [
      { type: "shopify-product", title: "Shopify Product", icon: ProductsMajor, category: "advanced" },
      { type: "shopify-collection", title: "Shopify Collection", icon: CollectionsMajor, category: "advanced" },
      { type: "video", title: "Video", icon: PlayMajor, category: "advanced" },
      { type: "custom-code", title: "Custom Code", icon: CodeMajor, category: "advanced" },
      { type: "form-builder", title: "Form Builder", icon: FormsMajor, category: "advanced" },
      { type: "social-media", title: "Social Media", icon: SocialMajor, category: "advanced" },
    ];
    
    const allWidgets = [...basicWidgets, ...advancedWidgets];
    const widgetsToShow = activeTab === 0 ? basicWidgets : advancedWidgets;
    
    return (
      <Card>
        <Card.Section>
          <Text variant="headingMd" as="h2">Widgets</Text>
        </Card.Section>
        <Tabs
          tabs={[
            { id: "basic", content: "Basic" },
            { id: "advanced", content: "Advanced" }
          ]}
          selected={activeTab}
          onSelect={setActiveTab}
        />
        <Card.Section>
          <BlockStack gap="400">
            {widgetsToShow.map((widget) => (
              <div
                key={widget.type}
                className="widget-item"
                draggable
                onDragStart={(e) => handleDragStart(e, widget)}
              >
                <InlineStack gap="200" align="center">
                  <Icon source={widget.icon} color="base" />
                  <Text variant="bodyMd">{widget.title}</Text>
                </InlineStack>
              </div>
            ))}
          </BlockStack>
        </Card.Section>
      </Card>
    );
  };
  
  // Render the properties panel
  const renderPropertiesPanel = () => {
    if (!selectedElement) {
      return (
        <Card>
          <Card.Section>
            <Text variant="headingMd" as="h2">Properties</Text>
            <Text variant="bodyMd" as="p" color="subdued">
              Select an element to edit its properties
            </Text>
          </Card.Section>
        </Card>
      );
    }
    
    return (
      <Card>
        <Card.Section>
          <Text variant="headingMd" as="h2">
            {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)} Properties
          </Text>
        </Card.Section>
        <Card.Section>
          <BlockStack gap="400">
            {selectedElement.type === "heading" || selectedElement.type === "text" ? (
              <TextField
                label="Content"
                value={selectedElement.content || ""}
                onChange={(value) => handleElementUpdate(selectedElement.id, "content", value)}
                multiline={selectedElement.type === "text" ? 4 : 1}
              />
            ) : null}
            
            {selectedElement.type === "button" ? (
              <>
                <TextField
                  label="Button Text"
                  value={selectedElement.content || ""}
                  onChange={(value) => handleElementUpdate(selectedElement.id, "content", value)}
                />
                <TextField
                  label="Link URL"
                  value={selectedElement.settings?.buttonLink || "#"}
                  onChange={(value) => handleElementUpdate(selectedElement.id, "settings.buttonLink", value)}
                />
              </>
            ) : null}
            
            {selectedElement.type === "image" ? (
              <>
                <TextField
                  label="Image URL"
                  value={selectedElement.content || ""}
                  onChange={(value) => handleElementUpdate(selectedElement.id, "content", value)}
                />
                <TextField
                  label="Alt Text"
                  value={selectedElement.settings?.altText || ""}
                  onChange={(value) => handleElementUpdate(selectedElement.id, "settings.altText", value)}
                />
              </>
            ) : null}
            
            <TextField
              label="Background Color"
              value={selectedElement.settings?.backgroundColor || "transparent"}
              onChange={(value) => handleElementUpdate(selectedElement.id, "settings.backgroundColor", value)}
              type="color"
            />
            
            {selectedElement.type !== "image" && selectedElement.type !== "divider" ? (
              <TextField
                label="Text Color"
                value={selectedElement.settings?.textColor || "#000000"}
                onChange={(value) => handleElementUpdate(selectedElement.id, "settings.textColor", value)}
                type="color"
              />
            ) : null}
            
            {selectedElement.type === "shopify-product" ? (
              <>
                <TextField
                  label="Product ID"
                  value={selectedElement.content?.productId || ""}
                  onChange={(value) => handleElementUpdate(selectedElement.id, "content.productId", value)}
                  helpText="Enter the Shopify product ID"
                />
                <TextField
                  label="Display Mode"
                  value={selectedElement.content?.displayMode || "single"}
                  onChange={(value) => handleElementUpdate(selectedElement.id, "content.displayMode", value)}
                  helpText="single, grid, or list"
                />
              </>
            ) : null}
            
            {selectedElement.type === "shopify-collection" ? (
              <>
                <TextField
                  label="Collection ID"
                  value={selectedElement.content?.collectionId || ""}
                  onChange={(value) => handleElementUpdate(selectedElement.id, "content.collectionId", value)}
                  helpText="Enter the Shopify collection ID"
                />
                <TextField
                  label="Display Mode"
                  value={selectedElement.content?.displayMode || "single"}
                  onChange={(value) => handleElementUpdate(selectedElement.id, "content.displayMode", value)}
                  helpText="single or grid"
                />
              </>
            ) : null}
            
            {selectedElement.type === "video" ? (
              <>
                <TextField
                  label="Video Type"
                  value={selectedElement.content?.videoType || "youtube"}
                  onChange={(value) => handleElementUpdate(selectedElement.id, "content.videoType", value)}
                  helpText="youtube, vimeo, or custom"
                />
                <TextField
                  label="Video ID"
                  value={selectedElement.content?.videoId || ""}
                  onChange={(value) => handleElementUpdate(selectedElement.id, "content.videoId", value)}
                  helpText="YouTube or Vimeo video ID"
                />
                <TextField
                  label="Custom Video URL"
                  value={selectedElement.content?.videoUrl || ""}
                  onChange={(value) => handleElementUpdate(selectedElement.id, "content.videoUrl", value)}
                  helpText="For custom video sources"
                />
                <TextField
                  label="Width"
                  value={selectedElement.content?.width || "100%"}
                  onChange={(value) => handleElementUpdate(selectedElement.id, "content.width", value)}
                />
                <TextField
                  label="Height"
                  value={selectedElement.content?.height || "400px"}
                  onChange={(value) => handleElementUpdate(selectedElement.id, "content.height", value)}
                />
              </>
            ) : null}
            
            {selectedElement.type === "custom-code" ? (
              <>
                <TextField
                  label="HTML Content"
                  value={selectedElement.content?.htmlContent || ""}
                  onChange={(value) => handleElementUpdate(selectedElement.id, "content.htmlContent", value)}
                  multiline={6}
                  helpText="Enter your HTML code"
                />
                <TextField
                  label="CSS Content"
                  value={selectedElement.content?.cssContent || ""}
                  onChange={(value) => handleElementUpdate(selectedElement.id, "content.cssContent", value)}
                  multiline={4}
                  helpText="Enter your CSS styles"
                />
                <TextField
                  label="JavaScript Content"
                  value={selectedElement.content?.jsContent || ""}
                  onChange={(value) => handleElementUpdate(selectedElement.id, "content.jsContent", value)}
                  multiline={4}
                  helpText="Enter your JavaScript code"
                />
              </>
            ) : null}
            
            {selectedElement.type === "form-builder" ? (
              <>
                <TextField
                  label="Form Title"
                  value={selectedElement.content?.title || ""}
                  onChange={(value) => handleElementUpdate(selectedElement.id, "content.title", value)}
                />
                <TextField
                  label="Form Description"
                  value={selectedElement.content?.description || ""}
                  onChange={(value) => handleElementUpdate(selectedElement.id, "content.description", value)}
                  multiline={3}
                />
                <TextField
                  label="Submit Button Text"
                  value={selectedElement.content?.submitButtonText || "Submit"}
                  onChange={(value) => handleElementUpdate(selectedElement.id, "content.submitButtonText", value)}
                />
                <Text variant="bodyMd" as="p" color="subdued">
                  Form fields: {selectedElement.content?.fields?.length || 0} fields configured
                </Text>
              </>
            ) : null}
            
            {selectedElement.type === "social-media" ? (
              <>
                <TextField
                  label="Platform"
                  value={selectedElement.content?.platform || "facebook"}
                  onChange={(value) => handleElementUpdate(selectedElement.id, "content.platform", value)}
                  helpText="facebook, twitter, instagram, youtube, etc."
                />
                <TextField
                  label="Content Type"
                  value={selectedElement.content?.contentType || "post"}
                  onChange={(value) => handleElementUpdate(selectedElement.id, "content.contentType", value)}
                  helpText="post, profile, feed, timeline, video, page"
                />
                <TextField
                  label="Content ID"
                  value={selectedElement.content?.id || ""}
                  onChange={(value) => handleElementUpdate(selectedElement.id, "content.id", value)}
                  helpText="Post ID, video ID, etc."
                />
                <TextField
                  label="Username/Handle"
                  value={selectedElement.content?.username || ""}
                  onChange={(value) => handleElementUpdate(selectedElement.id, "content.username", value)}
                  helpText="Social media username or handle"
                />
              </>
            ) : null}
            
            <Button destructive onClick={() => handleElementDelete(selectedElement.id)}>
              Delete Element
            </Button>
          </BlockStack>
        </Card.Section>
      </Card>
    );
  };
  
  // Render a single element
  const renderElement = (element) => {
    const isSelected = selectedElement && selectedElement.id === element.id;
    const elementStyle = {
      backgroundColor: element.settings?.backgroundColor || "transparent",
      color: element.settings?.textColor || "#000000",
      marginTop: element.settings?.marginTop || "0",
      marginBottom: element.settings?.marginBottom || "20px",
      marginLeft: element.settings?.marginLeft || "0",
      marginRight: element.settings?.marginRight || "0",
      paddingTop: element.settings?.paddingTop || "0",
      paddingBottom: element.settings?.paddingBottom || "0",
      paddingLeft: element.settings?.paddingLeft || "0",
      paddingRight: element.settings?.paddingRight || "0",
      border: isSelected ? "2px solid #2c6ecb" : "2px solid transparent",
      borderRadius: "4px",
      cursor: "pointer",
      position: "relative"
    };
    
    switch (element.type) {
      case "heading":
        return (
          <div 
            key={element.id} 
            className="builder-element" 
            style={elementStyle}
            onClick={() => handleElementSelect(element)}
          >
            <h2 style={{ 
              fontSize: element.settings?.fontSize || "24px",
              fontWeight: element.settings?.fontWeight || "bold",
              textAlign: element.settings?.textAlign || "left",
              margin: 0
            }}>
              {element.content}
            </h2>
          </div>
        );
      
      case "text":
        return (
          <div 
            key={element.id} 
            className="builder-element" 
            style={elementStyle}
            onClick={() => handleElementSelect(element)}
          >
            <p style={{ 
              fontSize: element.settings?.fontSize || "16px",
              fontWeight: element.settings?.fontWeight || "normal",
              textAlign: element.settings?.textAlign || "left",
              margin: 0
            }}>
              {element.content}
            </p>
          </div>
        );
      
      case "button":
        return (
          <div 
            key={element.id} 
            className="builder-element" 
            style={elementStyle}
            onClick={() => handleElementSelect(element)}
          >
            <button style={{
              backgroundColor: element.settings?.buttonColor || "#2c6ecb",
              color: element.settings?.buttonTextColor || "#ffffff",
              border: "none",
              borderRadius: element.settings?.buttonRadius || "4px",
              padding: "8px 16px",
              fontSize: "14px",
              cursor: "pointer"
            }}>
              {element.content}
            </button>
          </div>
        );
      
      case "image":
        return (
          <div 
            key={element.id} 
            className="builder-element" 
            style={elementStyle}
            onClick={() => handleElementSelect(element)}
          >
            <img 
              src={element.content || "https://via.placeholder.com/400x200"} 
              alt={element.settings?.altText || "Image"} 
              style={{
                width: element.settings?.width || "100%",
                height: element.settings?.height || "auto",
                borderRadius: element.settings?.borderRadius || "0"
              }}
            />
          </div>
        );
      
      case "divider":
        return (
          <div 
            key={element.id} 
            className="builder-element" 
            style={elementStyle}
            onClick={() => handleElementSelect(element)}
          >
            <hr style={{
              border: "none",
              borderTop: `${element.settings?.dividerThickness || "1px"} ${element.settings?.dividerStyle || "solid"} ${element.settings?.dividerColor || "#e1e3e5"}`,
              margin: "10px 0"
            }} />
          </div>
        );
      
      case "section":
        return (
          <div 
            key={element.id} 
            className="builder-element" 
            style={{
              ...elementStyle,
              width: element.settings?.width || "100%",
              maxWidth: element.settings?.maxWidth || "1200px",
              minHeight: element.settings?.minHeight || "100px",
              margin: "0 auto 20px"
            }}
            onClick={() => handleElementSelect(element)}
          >
            <div style={{ padding: "20px" }}>
              {element.content && Array.isArray(element.content) && element.content.length > 0 ? (
                element.content.map(childElement => renderElement(childElement))
              ) : (
                <Text variant="bodyMd" as="p" alignment="center" color="subdued">
                  Empty Section - Drag elements here
                </Text>
              )}
            </div>
          </div>
        );
      
      case "shopify-product":
        return (
          <div 
            key={element.id} 
            className="builder-element" 
            style={elementStyle}
            onClick={() => handleElementSelect(element)}
          >
            <div style={{ 
              padding: "20px", 
              border: "2px dashed #e1e3e5", 
              borderRadius: "8px",
              textAlign: "center",
              backgroundColor: "#f9f9f9"
            }}>
              <ProductsMajor style={{ width: "48px", height: "48px", margin: "0 auto 10px", color: "#6b7280" }} />
              <Text variant="headingMd" as="h3">Shopify Product</Text>
              <Text variant="bodyMd" as="p" color="subdued">
                Product ID: {element.content?.productId || "Not selected"}
              </Text>
              <Text variant="bodyMd" as="p" color="subdued">
                Display: {element.content?.displayMode || "single"}
              </Text>
            </div>
          </div>
        );
      
      case "shopify-collection":
        return (
          <div 
            key={element.id} 
            className="builder-element" 
            style={elementStyle}
            onClick={() => handleElementSelect(element)}
          >
            <div style={{ 
              padding: "20px", 
              border: "2px dashed #e1e3e5", 
              borderRadius: "8px",
              textAlign: "center",
              backgroundColor: "#f9f9f9"
            }}>
              <CollectionsMajor style={{ width: "48px", height: "48px", margin: "0 auto 10px", color: "#6b7280" }} />
              <Text variant="headingMd" as="h3">Shopify Collection</Text>
              <Text variant="bodyMd" as="p" color="subdued">
                Collection ID: {element.content?.collectionId || "Not selected"}
              </Text>
              <Text variant="bodyMd" as="p" color="subdued">
                Display: {element.content?.displayMode || "single"}
              </Text>
            </div>
          </div>
        );
      
      case "video":
        return (
          <div 
            key={element.id} 
            className="builder-element" 
            style={elementStyle}
            onClick={() => handleElementSelect(element)}
          >
            <div style={{ 
              padding: "20px", 
              border: "2px dashed #e1e3e5", 
              borderRadius: "8px",
              textAlign: "center",
              backgroundColor: "#f9f9f9",
              width: element.content?.width || "100%",
              height: element.content?.height || "400px"
            }}>
              <PlayMajor style={{ width: "48px", height: "48px", margin: "0 auto 10px", color: "#6b7280" }} />
              <Text variant="headingMd" as="h3">Video Widget</Text>
              <Text variant="bodyMd" as="p" color="subdued">
                Source: {element.content?.videoType || "youtube"}
              </Text>
              <Text variant="bodyMd" as="p" color="subdued">
                {element.content?.videoId ? `ID: ${element.content.videoId}` : "No video selected"}
              </Text>
            </div>
          </div>
        );
      
      case "custom-code":
        return (
          <div 
            key={element.id} 
            className="builder-element" 
            style={elementStyle}
            onClick={() => handleElementSelect(element)}
          >
            <div style={{ 
              padding: "20px", 
              border: "2px dashed #e1e3e5", 
              borderRadius: "8px",
              textAlign: "center",
              backgroundColor: "#f9f9f9"
            }}>
              <CodeMajor style={{ width: "48px", height: "48px", margin: "0 auto 10px", color: "#6b7280" }} />
              <Text variant="headingMd" as="h3">Custom Code</Text>
              <Text variant="bodyMd" as="p" color="subdued">
                HTML: {element.content?.htmlContent ? "✓" : "Empty"}
              </Text>
              <Text variant="bodyMd" as="p" color="subdued">
                CSS: {element.content?.cssContent ? "✓" : "Empty"}
              </Text>
              <Text variant="bodyMd" as="p" color="subdued">
                JS: {element.content?.jsContent ? "✓" : "Empty"}
              </Text>
            </div>
          </div>
        );
      
      case "form-builder":
        return (
          <div 
            key={element.id} 
            className="builder-element" 
            style={elementStyle}
            onClick={() => handleElementSelect(element)}
          >
            <div style={{ 
              padding: "20px", 
              border: "2px dashed #e1e3e5", 
              borderRadius: "8px",
              textAlign: "center",
              backgroundColor: "#f9f9f9"
            }}>
              <FormsMajor style={{ width: "48px", height: "48px", margin: "0 auto 10px", color: "#6b7280" }} />
              <Text variant="headingMd" as="h3">Form Builder</Text>
              <Text variant="bodyMd" as="p" color="subdued">
                Title: {element.content?.title || "Contact Form"}
              </Text>
              <Text variant="bodyMd" as="p" color="subdued">
                Fields: {element.content?.fields?.length || 0}
              </Text>
            </div>
          </div>
        );
      
      case "social-media":
        return (
          <div 
            key={element.id} 
            className="builder-element" 
            style={elementStyle}
            onClick={() => handleElementSelect(element)}
          >
            <div style={{ 
              padding: "20px", 
              border: "2px dashed #e1e3e5", 
              borderRadius: "8px",
              textAlign: "center",
              backgroundColor: "#f9f9f9"
            }}>
              <SocialMajor style={{ width: "48px", height: "48px", margin: "0 auto 10px", color: "#6b7280" }} />
              <Text variant="headingMd" as="h3">Social Media</Text>
              <Text variant="bodyMd" as="p" color="subdued">
                Platform: {element.content?.platform || "facebook"}
              </Text>
              <Text variant="bodyMd" as="p" color="subdued">
                Type: {element.content?.contentType || "post"}
              </Text>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  // Render the editor
  const renderEditor = () => {
    return (
      <div className={`page-builder-editor ${viewMode}`}>
        <div 
          className="editor-content"
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {pageElements.length > 0 ? (
            pageElements.map(element => renderElement(element))
          ) : (
            <div className="placeholder-content">
              <Text variant="headingLg" as="h2" alignment="center">
                Drag and drop widgets here to build your page
              </Text>
              <Text variant="bodyMd" as="p" alignment="center">
                Select widgets from the left panel and customize their properties in the right panel
              </Text>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="page-builder" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {renderToolbar()}
      
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div style={{ width: "300px", overflowY: "auto", backgroundColor: "#ffffff", borderRight: "1px solid #e1e3e5", padding: "16px" }}>
          {renderWidgetPanel()}
        </div>
        
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {renderEditor()}
        </div>
        
        <div style={{ width: "300px", overflowY: "auto", backgroundColor: "#ffffff", borderLeft: "1px solid #e1e3e5", padding: "16px" }}>
          {renderPropertiesPanel()}
        </div>
      </div>
      
      {showToast && (
        <Toast
          content={toastMessage}
          error={toastError}
          onDismiss={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
