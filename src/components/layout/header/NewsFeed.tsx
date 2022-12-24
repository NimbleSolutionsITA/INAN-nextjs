import {useTheme} from "@mui/material/styles";
import {Box, useMediaQuery} from "@mui/material";
import Container from "../../Container";
import {NewsFeed} from "../../../utils/layout";

type SingleNews = {
    title: {
        rendered: string
    }
}

type NewsFeedProps = {
    currentNews: NewsFeed[]
}

const NewsFeed = ({ currentNews }: NewsFeedProps) => {
    const muiTheme = useTheme()
    const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"))
    return currentNews?.length > 0 ? (
        <Box
            sx={{
                width: '100%',
                textTransform: 'uppercase',
                color: isMobile ? 'none' : '1px solid',
                borderBottom: isMobile ? 'none' : '1px solid',
                borderTop: isMobile ? '1px solid' : 'none',
            }}
        >
            {currentNews && (isMobile ? (
                <Container>{currentNews[0].title}</Container>
            ) : currentNews[0].title)}
        </Box>
    ) : <span />
}

export default NewsFeed;