// components
import { Icon } from "@iconify/react";
// ----------------------------------------------------------------------

const sidebarConfig = [
  {
    title: "dashboard",
    path: "/dashboard",
    icon: <Icon icon="ant-design:dashboard-outlined" />,
    isSearch: false,
  },
  {
    title: "categories",
    path: "/categories",
    icon: <Icon icon="bx:category" />,
    isSearch: true,
    children: [
      {
        title: "main-categories",
        path: "/categories/main-categories",
        icon: <Icon icon="majesticons:users-line" />,
      },
      {
        title: "sub-categories",
        path: "/categories/sub-categories",
        icon: <Icon icon="majesticons:users-line" />,
      },
    ],
  },
  {
    title: "brands",
    path: "/brands",
    icon: <Icon icon="iconamoon:badge" />,
    isSearch: true,
  },
  {
    title: "product",
    path: "/products",
    icon: <Icon icon="fluent:building-shop-20-regular" />,
    isSearch: true,
  },
  {
    title: "customers",
    path: "/customers",
    icon: <Icon icon="fluent:building-shop-20-regular" />,
    isSearch: true,
  },
  // {
  //   title: "AMC",
  //   path: "/amcs",
  //   icon: <Icon icon="carbon:manage-protection" />,
  //   isSearch: true,
  // },
  {
    title: "AMC",
    path: "/amcs",
    icon: <Icon icon="carbon:manage-protection" />,
    isSearch: true,
    children: [
      {
        title: "AMC List",
        path: "/amcs/list",
        icon: <Icon icon="majesticons:users-line" />,
      },
      {
        title: "Series Number",
        path: "/amcs/seriesno",
        icon: <Icon icon="majesticons:users-line" />,
      },
    ],
  },
  {
    title: "orders",
    path: "/orders",
    icon: <Icon icon="bi:cart-check" />,
    isSearch: true,
  },
  // {
  //   title: "Sliders",
  //   path: "/sliders",
  //   icon: <Icon icon="majesticons:users-line" />,
  //   // isSearch: true,
  //   children: [
  //     {
  //       title: "Home Slider",
  //       path: "/home-slider",
  //       icon: <Icon icon="majesticons:users-line" />,
  //     },
  //     {
  //       title: "Home Banners",
  //       path: "/home-banners",
  //       icon: <Icon icon="majesticons:users-line" />,
  //     },
  //   ],
  // },
  {
    title: "users",
    path: "/users",
    icon: <Icon icon="majesticons:users-line" />,
    isSearch: true,
  },
  // {
  //   title: "newsletter",
  //   path: "/newsletter",
  //   icon: <Icon icon="clarity:email-line" />,
  // },
  {
    title: "setting",
    path: "/settings",
    icon: <Icon icon="bytesize:settings" />,
    isSearch: false,
    children: [
      {
        title: "front-end-app",
        path: "/settings/application",
        icon: <Icon icon="majesticons:users-line" />,
      },
      {
        title: "general",
        path: "/settings/general",
        icon: <Icon icon="majesticons:users-line" />,
      },
      {
        title: "Shipping Charges",
        path: "/settings/shippingcharges",
        icon: <Icon icon="majesticons:users-line" />,
      },
    ],
  },
];

export default sidebarConfig;
