import { Navigate, useRoutes } from "react-router-dom";
import { Suspense, lazy } from "react";

// layouts
import DashboardLayout from "src/layouts/dashboard";
import AuthLayout from "src/layouts/auth";
import LoadingScreen from "src/components/loadingScreen";
import SeriesNumber from "src/components/forms/amc/seriesNo";
// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            top: 0,
            left: 0,
            width: 1,
            zIndex: 9999,
            position: "fixed",
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: "*",
      element: <AuthLayout />,
      children: [
        { path: "404", element: <NotFound /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard" replace /> },
        { path: "dashboard", element: <LandingPage /> },
        { path: "orders", element: <AllOrder /> },
        { path: "orders/:id", element: <OrderDetail /> },
        { path: "products", element: <Products /> },
        { path: "products/add", element: <AddProduct /> },
        { path: "products/:pid", element: <ProductUpdate /> },
        // Brands routes addess
        { path: "brands", element: <Brands /> },
        { path: "brands/add", element: <AddBrand /> },
        { path: "brands/:bid", element: <BrandUpdate /> },

        // Amcs Routes address
        { path: "amcs/list", element: <Amcs /> },
        { path: "amcs/add", element: <AddAmc /> },
        { path: "amcs/:aid", element: <AmcUpdate /> },

        //
        { path: "amcs/seriesno", element: <SeriesNumber /> },

        { path: "categories/main-categories", element: <Categories /> },
        { path: "categories/main-categories/add", element: <AddCategory /> },
        { path: "categories/main-categories/:cid", element: <EditCategory /> },
        { path: "categories/sub-categories", element: <SubCategories /> },
        { path: "categories/sub-categories/add", element: <AddSubCategory /> },
        {
          path: "categories/sub-categories/:cid",
          element: <EditSubCategory />,
        },
        {
          path: "settings/application/slides/add",
          element: <AddPrimarySlider />,
        },
        {
          path: "settings/application/slides/:sid",
          element: <EditPrimarySlider />,
        },
        { path: "users", element: <Users /> },
        { path: "users/:id", element: <UserProfile /> },
        { path: "users/:id/addproduct", element: <AddProductForUser /> },
        { path: "users/:id/addamc", element: <AddAmcForUser /> },
        { path: "users/add", element: <AddUser /> },
        { path: "users/edit/:id", element: <EditUser /> },
        { path: "newsletter", element: <Newsletter /> },
        { path: "settings/general", element: <GeneralSettings /> },
        { path: "settings/application", element: <AppSettings /> },
        { path: "settings/shippingcharges", element: <ShippingCharges /> },
        {
          path: "settings/application/home-banners/edit",
          element: <EditBanners />,
        },

        // customers
        { path: "/customers", element: <CustomersList /> },
        { path: "/customers/add", element: <AddCustomer /> },
        { path: "/customers/:id", element: <CustomerProfile /> },

        //cart
        { path: "/addproducts", element: <AddProductForCustomer /> },
        { path: "/cart", element: <Cart /> }
      ],
    },
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        { path: "login", element: <Login /> },
        {
          path: "/auth/forget-password",
          element: <ForgetPassword />,
        },
        {
          path: "/auth/reset-password",
          element: <ResetPassword />,
        },
        // {
        //   path: "/auth/register",
        //   element: <Register />,
        // },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

const AllOrder = Loadable(lazy(() => import("src/pages/orders")));
const OrderDetail = Loadable(
  lazy(() => import("src/pages/orders/orderDetail"))
);
const Products = Loadable(lazy(() => import("src/pages/products")));
const AddProduct = Loadable(
  lazy(() => import("src/pages/products/addProduct"))
);
const ProductUpdate = Loadable(
  lazy(() => import("src/pages/products/editProduct"))
);
// Brands ----------------------
const Brands = Loadable(lazy(() => import("src/pages/brands")));
const AddBrand = Loadable(lazy(() => import("src/pages/brands/addBrand")));
const BrandUpdate = Loadable(lazy(() => import("src/pages/brands/editBrand")));

//Amcs --------------------------
const Amcs = Loadable(lazy(() => import("src/pages/amcs")));
const AddAmc = Loadable(lazy(() => import("src/pages/amcs/addAmc")));
const AmcUpdate = Loadable(lazy(() => import("src/pages/amcs/editAmc")));

//
const SerialNumber = Loadable(
  lazy(() => import("src/pages/amcs/seriesNumber"))
);

const Categories = Loadable(lazy(() => import("src/pages/categories")));
const SubCategories = Loadable(
  lazy(() => import("src/pages/categories/subCategories"))
);
const Users = Loadable(lazy(() => import("src/pages/users")));
const UserProfile = Loadable(lazy(() => import("src/pages/users/profile")));
const AddUser = Loadable(lazy(() => import("src/pages/users/addUser")));
const EditUser = Loadable(lazy(() => import("src/pages/users/editUser")));
const AddProductForUser = Loadable(
  lazy(() => import("src/pages/users/addProduct"))
);
const AddAmcForUser = Loadable(lazy(() => import("src/pages/users/addAmc")));

const AddCategory = Loadable(
  lazy(() => import("src/pages/categories/addCategory"))
);
const AddSubCategory = Loadable(
  lazy(() => import("src/pages/categories/subCategories/addCategory"))
);
const EditCategory = Loadable(
  lazy(() => import("src/pages/categories/editCategory"))
);
const EditSubCategory = Loadable(
  lazy(() => import("src/pages/categories/subCategories/editCategory"))
);
const GeneralSettings = Loadable(
  lazy(() => import("src/pages/settings/general"))
);
const ShippingCharges = Loadable(
  lazy(() => import("src/pages/settings/shippingCharges"))
);
const AppSettings = Loadable(
  lazy(() => import("src/pages/settings/application"))
);
const AddPrimarySlider = Loadable(
  lazy(() => import("src/pages/settings/application/homeSlides/addHomeSlide"))
);
const EditPrimarySlider = Loadable(
  lazy(() => import("src/pages/settings/application/homeSlides/editHomeSlide"))
);
const EditBanners = Loadable(
  lazy(() => import("src/pages/settings/application/homeBanners/editBanners"))
);

// Main
const LandingPage = Loadable(lazy(() => import("src/pages")));

// notfound
const NotFound = Loadable(lazy(() => import("src/pages/404")));

// auth
const ForgetPassword = Loadable(
  lazy(() => import("src/pages/auth/forgetPassword"))
);
const ResetPassword = Loadable(
  lazy(() => import("src/pages/auth/resetPassword"))
);
const Login = Loadable(lazy(() => import("src/pages/auth/login")));
const Newsletter = Loadable(lazy(() => import("src/pages/newsletter")));
const Register = Loadable(lazy(() => import("src/pages/auth/register")));

//customers 
const CustomersList = Loadable(lazy(() => import("src/pages/customers")));
const AddCustomer = Loadable(lazy(() => import("src/pages/customers/addCustomer")));
const CustomerProfile = Loadable(lazy(() => import("src/pages/customers/profile")));
const AddProductForCustomer = Loadable(lazy(() => import("src/pages/customers/addProduct")));

//cart
const Cart = Loadable(lazy(() => import("src/pages/cart")))