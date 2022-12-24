import {Typography} from "@mui/material";
import {sanitize} from "../utils/helpers";

const RichText = ({ children, ...props }: { children: any, [key: string]: any} ) => {
    return (
        <Typography
            variant="body1"
            component="div"
            dangerouslySetInnerHTML={{__html: sanitize(children)}}
            {...props}
        />
    )
}

export default RichText