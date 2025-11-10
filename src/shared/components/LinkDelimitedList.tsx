
import { Link } from 'react-router-dom';


export type LinkData = {
    name: string;
    path: string;
}

/**
 * Creates a delimited list of links.
 * @param props An object containing an Array called 'items' of LinkDataa objects containing link data.
 * @returns An array of JSX elements that can be displayed.
 */
export default function LinkDelimitedList(props: { items: Array<LinkData>, separator: string }): JSX.Element[][] {

    // Return
    return (

        // Map
        props.items.map((LinkData: LinkData, i: number) => {

            // Initialize
            let link: JSX.Element[] = [];

            // If this is the second or later link, add a separator.
            if (i > 0) {
                link.push(<span key={`sep-${i}`}>{props.separator}</span>);
            }

            // Add markup
            link.push(<Link key={LinkData.name} to={LinkData.path}>{LinkData.name}</Link>);

            // Return
            return link;

        })
    );
}