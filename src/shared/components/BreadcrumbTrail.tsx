
import { Link } from 'react-router-dom';


export type Breadcrumb = {
    name: string;
    path: string;
}

/**
 * Creates breadcrumb navigation links.
 * @param props An object containing an Array called 'breadcrumbs' of Breadcrumb objects representing the breadcrumb trail.
 * @returns An array of JSX elements that can be displayed.
 */
function BreadcrumbTrail(props: {breadcrumbs: Array<Breadcrumb>} ): JSX.Element[][] {
    
    // Return
    return (

        // Map
        props.breadcrumbs.map((Breadcrumb: Breadcrumb, i: number) => {

            // Initialize
            let navLink: JSX.Element[] = [];

            // If this is the second or later link, add a separator.
            if (i > 0) {
                navLink.push(<span key={`sep-${i}`}> &gt; </span>);
            }

            // Add markup
            navLink.push(<Link key={Breadcrumb.name} to={Breadcrumb.path}>{Breadcrumb.name}</Link>);

            // Return
            return navLink;

        })
    );
}

export default BreadcrumbTrail;