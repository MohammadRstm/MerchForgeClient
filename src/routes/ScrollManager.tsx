import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router';

/**
 * Puts a newly-navigated page at the top, or at the section its hash names.
 *
 * The browser does this for a normal document load; a client-side router does
 * not. Without it the scroll offset simply carries across a navigation, which
 * produced two bugs that looked unrelated and were the same thing: opening a
 * plan from the pricing grid landed near the bottom of the plan page, and
 * "Compare all plans" appeared to point at the wrong section - it went to
 * /#pricing correctly, but React Router's Link does not act on a hash, so the
 * old offset was kept and whatever section happened to sit there looked like
 * the target.
 *
 * Deliberately only reacts when the *path* changes. An in-page anchor - the
 * header and footer links to #studio, #pricing and the rest - is the browser's
 * own job, and it already does it with the smooth behaviour set in Home.css.
 * Running this on those too would fight it and jump instead.
 */
export default function ScrollManager() {
    const { pathname, hash } = useLocation();
    const previousPathname = useRef<string | null>(null);

    useLayoutEffect(() => {
        const isFirstRender = previousPathname.current === null;
        const changedPage = previousPathname.current !== pathname;
        previousPathname.current = pathname;

        // A hash on first load is the browser's to honour, exactly as it would
        // on any other site - re-doing it here would only race it.
        if (!changedPage || isFirstRender) return;

        if (!hash) {
            window.scrollTo(0, 0);
            return;
        }

        const target = document.querySelector(hash);

        if (!target) {
            // A hash naming nothing on the new page is still a new page, and the
            // reader should start at the top of it rather than wherever they
            // happened to be on the last one.
            window.scrollTo(0, 0);
            return;
        }

        // 'instant' against the smooth scrolling Home.css turns on globally:
        // easing across a page the reader has not seen yet animates through
        // content rather than revealing it, and lands them somewhere they did
        // not watch arrive.
        target.scrollIntoView({ behavior: 'instant', block: 'start' });
    }, [pathname, hash]);

    return null;
}
