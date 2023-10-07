import * as api from "src/services";
import { useQuery } from "react-query";
// notification
import toast from 'react-hot-toast';
// components
import {
    HeaderBreadcrumbs,
    Toolbar,
    UserCard,
    Table,
    CustomerRow,
    Page,
} from "src/components";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: "fullName", label: "Name", sort: true },
    { id: "email", label: "email", sort: true },
    { id: "phone", label: "phone" },
    { id: "status", label: "status", sort: true },
    { id: "joined", label: "joined" },
    { id: "", label: "actions", alignRight: true },
];

// ----------------------------------------------------------------------
export default function CustomersList() {

    const [searchParams] = useSearchParams();
    const pageParam = searchParams.get("page");
    const searchParam = searchParams.get("search");
    const { t } = useTranslation("user");
    const { data, isLoading } = useQuery(
        ["user", pageParam, searchParam],
        () => api.getUsers(+pageParam || 1, searchParam || ""),
        {
            onError: (err) => {
                toast.error(err.response.data.message || "Something went wrong!");
            },
        }
    );

    return (
        <>
            <Page title={`Users | ${process.env.REACT_APP_DOMAIN_NAME}`}>
                <Toolbar>
                    <HeaderBreadcrumbs
                        heading="Users List"
                        links={[
                            {
                                name: t("dashboard"),
                                href: "/dashboard",
                            },
                            {
                                name: t("customers"),
                                href: "/customers",
                            },
                        ]}
                        action={{
                            href: `/customers/add`,
                            title: t("add customer"),
                        }}
                    />
                </Toolbar>
                <Table
                    headData={TABLE_HEAD}
                    data={data}
                    isLoading={isLoading}
                    row={CustomerRow}
                    mobileRow={UserCard}
                />
            </Page>
        </>
    );
}
