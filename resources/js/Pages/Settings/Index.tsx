import WorkspaceTitle from '@plunr/Components/WorkspaceTitle';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AccountTab from '@plunr/Components/settings/hub/AccountTab';
import CurrenciesTab from '@plunr/Components/settings/hub/CurrenciesTab';
import NotificationsTab from '@plunr/Components/settings/hub/NotificationsTab';
import SecurityTab from '@plunr/Components/settings/hub/SecurityTab';
import LocalizationTab from '@plunr/Components/settings/hub/LocalizationTab';
import CountriesTab from '@plunr/Components/settings/hub/CountriesTab';
import EmailTemplatesTab from '@plunr/Components/settings/hub/EmailTemplatesTab';
import WorkspaceTab from '@plunr/Components/settings/hub/WorkspaceTab';
import MenuCodesTab from '@plunr/Components/settings/hub/MenuCodesTab';
import QuickAccessTab from '@plunr/Components/settings/hub/QuickAccessTab';
import AIIntegration from '@plunr/Components/settings/hub/AIIntegration';
import { Card, CardContent } from '@plunr/Components/ui/card';
import { Head, router } from '@inertiajs/react';
import {
    Building2,
    Bell,
    Eye,
    Hash,
    MonitorCog,
    Settings2,
    ShieldCheck,
    Sparkles,
    Languages,
    Mail,
    Globe,
    Coins,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const baseTabs = [
    { key: 'account', label: 'Account', icon: Building2 },
    { key: 'ai-integration', label: 'AI Integration', icon: Sparkles },
    { key: 'email-templates', label: 'Email Templates', icon: Mail },
    { key: 'countries', label: 'Countries', icon: Globe },
    { key: 'currencies', label: 'Currencies', icon: Coins },
    { key: 'localization', label: 'Localization', icon: Languages },
    { key: 'menu-codes', label: 'Menu Codes', icon: Hash },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'quick-access', label: 'Quick Access', icon: Eye },
    { key: 'security', label: 'Security', icon: ShieldCheck },
    { key: 'workspace', label: 'Theme Customizer', icon: MonitorCog },
];

export default function SettingsHubPage(props) {
    const {
        activeTab = 'workspace',
        twoFactor = {},
        browserSessions = [],
        ticketAutomation = {},
        automationHealth = {},
        infrastructureDiagnostics = {},
        outgoingEmailSettings = {},
        emailIngestion = {},
        emailIngestionUsers = [],
        emailIngestionTeams = [],
        emailIngestionStatuses = [],
        emailIngestionLogs = [],
        canManageAccessControl = false,
        canManageAccessControlRoleCatalog = false,
        accessUsers = [],
        accessRoles = [],
        accessPermissions = [],
        accessProcurementGroups = [],
        accessSupplierPortalInvites = [],
        procurementGroupOptions = [],
        procurementScopeOptions = { agencies: [], suppliers: [] },
        accountProfile = {},
        localizationSettings = {},
        googleSharedCalendar = {},
        emailTemplates = [],
        countrySettings = {},
        currencySettings = {},
        accessTeamOptions = [],
        quickAccess = {},
        errors = {},
    } = props;

    const [selectedTab, setSelectedTab] = useState(activeTab);
    const tabs = baseTabs;
    const activeMobileTabRef = useRef(null);

    useEffect(() => {
        setSelectedTab(activeTab);
    }, [activeTab]);

    useEffect(() => {
        activeMobileTabRef.current?.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest',
        });
    }, [selectedTab]);

    const changeTab = (tabKey) => {
        if (tabKey === selectedTab) return;
        setSelectedTab(tabKey);
        router.get(
            route('settings.index'),
            { tab: tabKey },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const activeComponent = useMemo(() => {
        if (selectedTab !== activeTab) {
            return (
                <Card className="border-slate-200 dark:border-slate-800">
                    <CardContent className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                        Loading...
                    </CardContent>
                </Card>
            );
        }

        switch (selectedTab) {
            case 'account':
                return <AccountTab accountProfile={accountProfile} />;
            case 'workspace':
                return <WorkspaceTab />;
            case 'menu-codes':
                return <MenuCodesTab />;
            case 'localization':
                return <LocalizationTab localizationSettings={localizationSettings} />;
            case 'countries':
                return <CountriesTab countrySettings={countrySettings} />;
            case 'currencies':
                return <CurrenciesTab currencySettings={currencySettings} />;
            case 'notifications':
                return (
                    <NotificationsTab
                        ticketAutomation={ticketAutomation}
                        automationHealth={automationHealth}
                        infrastructureDiagnostics={infrastructureDiagnostics}
                        outgoingEmailSettings={outgoingEmailSettings}
                        emailIngestion={emailIngestion}
                        emailIngestionUsers={emailIngestionUsers}
                        emailIngestionTeams={emailIngestionTeams}
                        emailIngestionStatuses={emailIngestionStatuses}
                        emailIngestionLogs={emailIngestionLogs}
                        errors={errors}
                    />
                );
            case 'email-templates':
                return <EmailTemplatesTab templates={emailTemplates} />;
            case 'security':
                return (
                    <SecurityTab
                        twoFactor={twoFactor}
                        browserSessions={browserSessions}
                    />
                );
            case 'ai-integration':
                return <AIIntegration />;
            case 'quick-access':
                return <QuickAccessTab quickAccess={quickAccess} />;
            default:
                return <WorkspaceTab />;
        }
    }, [
        accessPermissions,
        accessProcurementGroups,
        accessSupplierPortalInvites,
        accessRoles,
        accessUsers,
        accessTeamOptions,
        procurementGroupOptions,
        procurementScopeOptions,
        accountProfile,
        localizationSettings,
        emailTemplates,
        countrySettings,
        currencySettings,
        quickAccess,
        automationHealth,
        infrastructureDiagnostics,
        browserSessions,
        canManageAccessControl,
        canManageAccessControlRoleCatalog,
        outgoingEmailSettings,
        emailIngestion,
        emailIngestionStatuses,
        emailIngestionTeams,
        emailIngestionUsers,
        emailIngestionLogs,
        errors,
        activeTab,
        selectedTab,
        ticketAutomation,
        twoFactor,
    ]);

    return (
        <AuthenticatedLayout header={<WorkspaceTitle title="Settings" icon={Settings2} />}>
            <Head title="Settings" />

            <div className="px-3 py-3 sm:px-4 sm:py-4 md:px-5">
                {/* Mobile / tablet: horizontal tab strip */}
                <div className="-mx-3 mb-4 overflow-x-auto px-3 pb-1 [scrollbar-width:thin] lg:hidden">
                    <div className="flex w-max gap-1.5">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const active = selectedTab === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    ref={active ? activeMobileTabRef : undefined}
                                    onClick={() => changeTab(tab.key)}
                                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                        active
                                            ? 'border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900'
                                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <Icon className="h-3.5 w-3.5 shrink-0" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[236px_minmax(0,1fr)] lg:gap-5">
                    <Card className="hidden h-fit border-slate-200 dark:border-slate-800 lg:block">
                        <CardContent className="space-y-0.5 p-2.5">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const active = selectedTab === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => changeTab(tab.key)}
                                        className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition ${
                                            active
                                                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <Icon className="h-4 w-4 shrink-0" />
                                        <span className="min-w-0 truncate">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </CardContent>
                    </Card>

                    <div className="min-w-0 self-start space-y-4">
                        {activeComponent}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

