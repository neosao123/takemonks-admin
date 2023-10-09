import { Tab, TableCell, TableRow } from "@mui/material";

export default function cartRow() {
    return (
        <TableRow hover key={Math.random()}>
            <TableRow>
                <TableCell
                    component="th"
                    scope="row"
                    padding="none"
                    sx={{ maxWidth: 300 }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {" "}
                        {isLoading ? (
                            <Skeleton
                                variant="rectangular"
                                width={50}
                                height={50}
                                sx={{ borderRadius: 1 }}
                            />
                        ) : Boolean(row.cover) > 0 ? (
                            <ThumbImgStyle alt={row?.name} src={row?.cover} />
                        ) : (
                            <Avatar> {row.name.slice(0, 1)} </Avatar>
                        )}{" "}
                        <Typography variant="subtitle2" noWrap>
                            {" "}
                            {isLoading ? (
                                <Skeleton variant="text" width={120} sx={{ ml: 1 }} />
                            ) : (
                                row?.name
                            )}{" "}
                        </Typography>{" "}
                    </Box>
                </TableCell>
            </TableRow>
        </TableRow>
    )
}