import {useTheme} from "@mui/material/styles";
import {Box, useMediaQuery} from "@mui/material";
import Container from "../../Container";
import {NewsFeed} from "../../../utils/layout";

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
                color: isMobile ? 'black' : 'none',
                borderBottom: isMobile ? 'none' : '1px solid',
                borderTop: isMobile ? '1px solid' : 'none',
                lineHeight: '24px',
                fontSize: '20px',
                fontWeight: 'bold'
            }}
        >
            {currentNews && (isMobile ? (
                <Container>
                    <div dangerouslySetInnerHTML={{__html: currentNews[0].title}}/>
                </Container>
            ) : <div dangerouslySetInnerHTML={{__html: currentNews[0].title}}/>)}
        </Box>
    ) : <span/>
}

export default NewsFeed;