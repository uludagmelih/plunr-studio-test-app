import { getSidebarNavigation, getSupplierPortalNavigation } from '@plunr/constants/navigation';
import { applyMenuCodeOverrides } from '@plunr/constants/navMenuCodes';
import { applyThemePrimaryColor } from '@plunr/constants/themeColors';
import { applyThemeFontFamily } from '@plunr/constants/themeFonts';
import { applyThemeDensity } from '@plunr/constants/themeDensity';
import {
    applySidebarColor,
    clearSidebarColor,
    layoutSupportsCustomSidebarColor,
    resolveWorkspaceAppearance,
    WORKSPACE_APPEARANCE_CHANGE_EVENT,
} from '@plunr/constants/workspaceAppearance';
import { isWorkspaceEmbedRequest } from '@plunr/constants/workspaceEmbed';
import EmbeddedWorkspaceLayout from '@plunr/Layouts/EmbeddedWorkspaceLayout';
import { getThemeShell } from '@plunr/Themes/registry';
import { usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

/**
 * Thin host resolver: pages keep wrapping AuthenticatedLayout;
 * the active installed template/layout provides the real chrome.
 *
 * Layout modules are resolved synchronously (eager registry) to avoid
 * a first-paint loading flash / sidebar flicker on every navigation.
 */
export default function AuthenticatedLayout({ header, children }) {
    const page = usePage();
    const {
        auth,
        branding = {},
        workspaceAppearance: serverAppearance,
        plunrTheme = 'classic',
        menuCodeOverrides = {},
        projectNavigation = [],
    } = page.props;
    const user = auth.user;
    const procurement = auth.procurement ?? {};
    const isSuperAdmin = Boolean(auth?.is_super_admin);
    const isSupplierPortalUser = Boolean(procurement.can_access_supplier_portal && !isSuperAdmin);
    const navigation = useMemo(() => {
        const raw = isSupplierPortalUser
            ? getSupplierPortalNavigation()
            : getSidebarNavigation({
                  canAccessBusiness: Boolean(auth?.can_access_business ?? isSuperAdmin),
                  canViewEmailLogs: Boolean(
                      auth?.can_view_email_logs ?? auth?.can_access_business ?? isSuperAdmin,
                  ),
                  canViewQueueMonitor: Boolean(auth?.is_admin || auth?.is_super_admin),
              });

        const project = Array.isArray(projectNavigation) ? projectNavigation : [];
        const bottomIndex = raw.findIndex((item) => item.section === 'Bottom');
        const merged = bottomIndex < 0
            ? [...raw, ...project]
            : [...raw.slice(0, bottomIndex), ...project, ...raw.slice(bottomIndex)];
        return applyMenuCodeOverrides(merged, menuCodeOverrides);
    }, [
        auth?.can_access_business,
        auth?.can_view_email_logs,
        auth?.is_admin,
        auth?.is_super_admin,
        isSuperAdmin,
        isSupplierPortalUser,
        menuCodeOverrides,
        projectNavigation,
    ]);

    const [appearance, setAppearance] = useState(() =>
        resolveWorkspaceAppearance(serverAppearance),
    );
    const [embedded, setEmbedded] = useState(() => isWorkspaceEmbedRequest());

    useEffect(() => {
        setEmbedded(isWorkspaceEmbedRequest());
    }, [page.url]);

    useEffect(() => {
        setAppearance((current) => {
            const next = resolveWorkspaceAppearance(serverAppearance);
            if (
                current.templateId === next.templateId
                && current.layoutId === next.layoutId
                && current.primaryColor === next.primaryColor
                && current.sidebarColor === next.sidebarColor
                && current.fontFamily === next.fontFamily
                && current.fontSize === next.fontSize
                && current.tableDensity === next.tableDensity
                && current.offCanvas === next.offCanvas
                && current.offCanvasKeepOpen === next.offCanvasKeepOpen
            ) {
                return current;
            }
            return next;
        });
    }, [serverAppearance]);

    useEffect(() => {
        const sync = (event) => {
            if (event?.detail) {
                setAppearance(event.detail);
                return;
            }
            setAppearance(resolveWorkspaceAppearance(serverAppearance));
        };

        window.addEventListener(WORKSPACE_APPEARANCE_CHANGE_EVENT, sync);
        window.addEventListener('storage', sync);
        return () => {
            window.removeEventListener(WORKSPACE_APPEARANCE_CHANGE_EVENT, sync);
            window.removeEventListener('storage', sync);
        };
    }, [serverAppearance]);

    // `templateId` is retained only for legacy workspace preference records.
    // Theme resolution is package-owned and pages never import a concrete shell.
    const themeId = appearance.themeId || plunrTheme || 'classic';
    const layoutId = isSupplierPortalUser ? 'classic' : appearance.layoutId || 'classic';
    const allowCustomSidebarColor = layoutSupportsCustomSidebarColor(layoutId);

    useEffect(() => {
        if (!appearance?.primaryColor) {
            return undefined;
        }

        applyThemePrimaryColor(appearance.primaryColor);
        if (allowCustomSidebarColor) {
            applySidebarColor(appearance.sidebarColor);
        } else {
            clearSidebarColor();
        }

        const observer = new MutationObserver(() => {
            applyThemePrimaryColor(appearance.primaryColor);
            if (allowCustomSidebarColor) {
                applySidebarColor(appearance.sidebarColor);
            } else {
                clearSidebarColor();
            }
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });
        return () => observer.disconnect();
    }, [appearance?.primaryColor, appearance?.sidebarColor, allowCustomSidebarColor]);

    useEffect(() => {
        if (!appearance?.fontFamily) {
            return;
        }
        applyThemeFontFamily(appearance.fontFamily);
    }, [appearance?.fontFamily]);

    useEffect(() => {
        applyThemeDensity({
            fontSize: appearance?.fontSize,
            tableDensity: appearance?.tableDensity,
        });
    }, [appearance?.fontSize, appearance?.tableDensity]);

    const LayoutComponent = useMemo(() => {
        return (
            getThemeShell(themeId, layoutId) ?? getThemeShell('classic', 'classic')
        );
    }, [themeId, layoutId]);

    useEffect(() => {
        document.documentElement.dataset.plunrTheme = themeId;
    }, [themeId]);

    if (embedded) {
        return (
            <EmbeddedWorkspaceLayout header={header}>
                {children}
            </EmbeddedWorkspaceLayout>
        );
    }

    if (!LayoutComponent) {
        return (
            <div className="flex min-h-svh items-center justify-center bg-slate-100 p-6 text-center dark:bg-slate-950">
                <div className="max-w-md rounded-xl border border-rose-200 bg-white p-6 text-sm text-rose-700 dark:border-rose-900 dark:bg-slate-900 dark:text-rose-300">
                    <p className="font-semibold">Workspace layout unavailable</p>
                    <p className="mt-2 whitespace-pre-wrap">
                        {`No theme shell for ${themeId}/${layoutId}. Run: php artisan plunr:themes`}
                    </p>
                    <div className="mt-4">{children}</div>
                </div>
            </div>
        );
    }

    return (
        <LayoutComponent
            user={user}
            navigation={navigation}
            header={header}
            branding={branding}
            sidebarColor={allowCustomSidebarColor ? appearance.sidebarColor : undefined}
            isSupplierPortalUser={isSupplierPortalUser}
            showAiAssistant={false}
            workspaceLabel="Workspace"
            offCanvas={Boolean(appearance.offCanvas)}
            offCanvasKeepOpen={Boolean(appearance.offCanvasKeepOpen)}
        >
            {children}
        </LayoutComponent>
    );
}
