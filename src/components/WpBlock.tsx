import {Typography} from "@mui/material";
import {WP_REST_API_Post} from "wp-types/index";

const WpBlock = ({content}: {content: WP_REST_API_Post}) => {
    return (
        <>
            <Typography variant="h1">{content.title.rendered}</Typography>
            <br />
            <div dangerouslySetInnerHTML={{__html: content.content.rendered}} />
        </>
    )
}

export default WpBlock