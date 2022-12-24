import Link from "../../Link"
import Container from "../../Container"
import {
    Divider,
    Drawer, IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import CloseIcon from "../../icons/CloseIcon";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {setHeader} from "../../../redux/headerSlice";

type SizeGuideProps = {
    sizes: Array<any>
}

const SizeGuide = ({sizes}: SizeGuideProps) => {
    const { sizeGuideOpen, isMobile} = useSelector((state: RootState) => state.header);
    const dispatch = useDispatch()
    const handleOpen = () => {
        dispatch(setHeader({sizeGuideOpen: true}))
    };
    const handleClose = () => {
        dispatch(setHeader({sizeGuideOpen: false}))
    };

    return (
        <>
            <Link style={{lineHeight: '15px'}} onClick={handleOpen} color="inherit"><b>Size guide</b></Link>
            <Drawer
                sx={{
                    zIndex: {xs: '1 !important', md: undefined},
                    '& .MuiDrawer-paper': {
                        height: '100vh',
                        width: '100%',
                        paddingTop: '70px',
                        textTransform: 'uppercase',
                        '& > div': {
                            height: '100%',
                        }
                    }
                }}
                anchor="top"
                open={sizeGuideOpen}
                onClose={() => handleClose}
            >
                <Container>
                    <div  style={{position: 'relative', marginTop: '15px'}}>
                        {!isMobile && <Divider />}
                        <Typography component="h4" variant={isMobile ? 'h2' : 'h1'} style={{padding: '5px 0'}}>Size Guide</Typography>
                        <IconButton disableRipple onClick={handleClose} style={{position: 'absolute', right: '-11px', top: isMobile ? '-7px' : '10px'}}><CloseIcon width={isMobile ? '14px' : '21px'} /></IconButton>
                    </div>
                    {isMobile ? (
                        <>
                            <br />
                            <br />
                            {sizes.map(row => (
                                <>
                                    <Divider />
                                    <Typography variant="h2">{row.title.rendered}</Typography>
                                    <Divider />
                                    <br />
                                    <Typography><b>Adjustable measures:</b> {row.acf.adj_measures}</Typography>
                                    <br />
                                    <Typography><b>Wearability:</b> {row.acf.wearability}</Typography>
                                    <br />
                                    <Typography><b>Matching size:</b> {row.acf.matching_size}</Typography>
                                    <br />
                                    <br />
                                </>
                            ))}
                        </>
                    ) : (
                        <>
                            <Divider style={{marginBottom: '35px'}} />
                            <TableContainer>
                                <Table  aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>{" "}</TableCell>
                                            <TableCell><Typography component="h3" variant="h3">Adj. measures</Typography></TableCell>
                                            <TableCell><Typography component="h3" variant="h3">Wearability</Typography></TableCell>
                                            <TableCell><Typography component="h3" variant="h3">Matching size</Typography></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sizes.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell component="th" scope="row">
                                                    <Typography component="h3" variant="h3">{row.title.rendered}</Typography>
                                                </TableCell>
                                                <TableCell>{row.acf.adj_measures}</TableCell>
                                                <TableCell>{row.acf.wearability}</TableCell>
                                                <TableCell>{row.acf.matching_size}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}
                </Container>
            </Drawer>
        </>
    )
}

export default SizeGuide