import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, clearProducts } from "./features/productSlice";
import { fetchCategories } from "./features/categorySlice";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Box,
  CardActions,
  CardMedia,
  Rating,
  Chip,
  ThemeProvider,
  createTheme,
} from "@mui/material";

// Custom color scheme
const theme = createTheme({
  palette: {
    primary: { main: "#3A3A3A" },
    secondary: { main: "#FFC107" },
    background: { default: "#F5F5F5" },
    text: { primary: "#2E2E2E" },
  },
});

const App = () => {
  const dispatch = useDispatch();
  
  const [searchParams, setSearchParams] = useSearchParams();

  const products = useSelector((state) => state.products.data);
  const productStatus = useSelector((state) => state.products.status);
  const categories = useSelector((state) => state.categories.data);
  const categoryStatus = useSelector((state) => state.categories.status);
  const hasMore = useSelector((state) => state.products.hasMore);
  const skip = useSelector((state) => state.products.skip);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const category = searchParams.get("category");
    const searchTerm = searchParams.get("search") || "";
    dispatch(fetchProducts({ category, search: searchTerm, skip: 0 }));
  }, [dispatch, searchParams]);

  const handleCategoryChange = useCallback(
    (category) => {
      setSelectedCategory(category);
      setSearchParams({ category, search });
      dispatch(clearProducts());
      dispatch(fetchProducts({ category, search, skip: 0 }));
    },
    [dispatch, search, setSearchParams]
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setSearchParams({ category: selectedCategory, search: e.target.value });
    dispatch(clearProducts());
    dispatch(fetchProducts({ category: selectedCategory, search: e.target.value, skip: 0 }));
  };

  const loadMoreProducts = () => {
    dispatch(fetchProducts({ category: selectedCategory, search, skip }));
  };

  const handleDetailsClick = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const renderTags = (tags) => (
    <Box sx={{ mt: 1 }}>
      {tags.map((tag, index) => (
        <Chip key={index} label={tag} variant="outlined" sx={{ marginRight: "5px", marginBottom: "5px" }} />
      ))}
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: "background.default", minHeight: "100vh", p: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, color: "text.primary" }}>
          ShopSphere
        </Typography>

        {/* Search Bar */}
        <Box sx={{ mb: 4 }}>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search for products..."
            style={{ padding: "10px", width: "100%", fontSize: "16px" }}
          />
        </Box>

        {/* Category Buttons */}
        <Box sx={{ mb: 4, display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Button
            variant={selectedCategory === "" ? "contained" : "outlined"}
            onClick={() => handleCategoryChange("")}
            sx={{ textTransform: "capitalize", borderRadius: "20px" }}
          >
            All Categories
          </Button>
          {categoryStatus === "success" &&
            categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "contained" : "outlined"}
                onClick={() => handleCategoryChange(category)}
                sx={{ textTransform: "capitalize", borderRadius: "20px" }}
              >
                {category}
              </Button>
            ))}
        </Box>

        {/* Product Cards */}
        <Grid container spacing={3}>
          {productStatus === "loading" && <CircularProgress />}
          {productStatus === "failed" && <Typography>Error fetching products.</Typography>}
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={product.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={product.thumbnail}
                  alt={product.title}
                  sx={{ objectFit: "contain" }}
                />
                <CardContent>
                  <Typography variant="h6" component="h2" sx={{ fontSize: "1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {product.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ${product.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rating: {product.rating} ⭐
                  </Typography>
                  {renderTags(product.tags)}
                </CardContent>
                <CardActions>
                  <Button variant="outlined" color="primary" fullWidth onClick={() => handleDetailsClick(product)}>
                    Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {hasMore && (
          <Button onClick={loadMoreProducts} variant="contained" sx={{ mt: 3 }}>
            Load More
          </Button>
        )}

        {/* Product Details Dialog */}
        {selectedProduct && (
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle>{selectedProduct.title}</DialogTitle>
            <DialogContent dividers sx={{ height: "80vh", overflowY: "auto" }}>
              {/* Image Collage */}
              <Grid container spacing={2}>
                {selectedProduct.images.map((image, index) => (
                  <Grid item xs={6} key={index}>
                    <img src={image} alt={`Product image ${index}`} style={{ width: "100%" }} />
                  </Grid>
                ))}
              </Grid>

              <Typography variant="h6" sx={{ mt: 2 }}>Price: ${selectedProduct.price}</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>Description: {selectedProduct.description}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>Warranty: {selectedProduct.warrantyInformation}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>Shipping: {selectedProduct.shippingInformation}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>Availability: {selectedProduct.availabilityStatus}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>Brand: {selectedProduct.brand}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>Category: {selectedProduct.category}</Typography>
              <Box>{renderTags(selectedProduct.tags)}</Box>

              {/* Rating and Reviews */}
              <Typography variant="h6" sx={{ mt: 3 }}>Rating: {selectedProduct.rating} ⭐</Typography>
              <Box>
                {selectedProduct.reviews.slice(0, 5).map((review, index) => (
                  <Box key={index} sx={{ mt: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>{review.reviewerName}</Typography>
                    <Typography variant="body2">{review.comment}</Typography>
                    <Rating value={review.rating} readOnly />
                  </Box>
                ))}
              </Box>
            </DialogContent>
          </Dialog>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default App;
