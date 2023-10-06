import React, { useState } from "react";

//components
import {
  HeaderBreadcrumbs,
  ProductNewForm,
  Toolbar,
  Page,
} from "src/components";
// notification
import toast from "react-hot-toast";
// api
import { useQuery } from "react-query";
import * as api from "src/services";
import { useTranslation } from "react-i18next";
import AddUserForm from "src/components/forms/user/addUserForm";
const buyAmcs = () => {
  return (
    <Page title={`Add User | ${process.env.REACT_APP_DOMAIN_NAME}`}>
      <Toolbar>
        <HeaderBreadcrumbs
          heading="User List"
          links={[
            { name: t("dashboard"), href: "/" },
            { name: t("users"), href: "/users" },
            { name: t("add") },
          ]}
        />
      </Toolbar>
      <AddUserForm
      // isLoading={isLoading}
      // isBrandLoading={isBrandLoading}
      // categories={isLoading ? [] : data?.data}
      // brands={isBrandLoading ? [] : brandata?.data}
      />
    </Page>
  );
};

export default buyAmcs;
