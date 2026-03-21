import { useNavigate, useNavigation, useSearchParams } from "react-router";
import { LogsResult } from "~/lib/link-logs.server";

type Props = JSX.IntrinsicElements["s-box"] & {
    logs: LogsResult;
    hasFilters?: boolean;
};

export function Table({ logs, hasFilters, ...props }: Props) {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const loading = useNavigation().state === "loading";

    function handleNextPage() {
        if (logs?.hasNextPage && logs.page) {
            const params = new URLSearchParams(searchParams);
            params.set("page", String(logs?.page + 1));
            navigate(`?${params.toString()}`);
        }
    }

    function handlePreviousPage() {
        if (logs?.hasPreviousPage && logs.page) {
            const params = new URLSearchParams(searchParams);
            params.set("page", String(logs?.page - 1));
            navigate(`?${params.toString()}`);
        }
    }

    function handleFilters(key: string, value: string) {
        const params = new URLSearchParams(searchParams);
        params.forEach((_, k) => params.delete(k));
        params.set(key, value);
        navigate(`?${params.toString()}`);
    }

    return (
        <s-box paddingBlockStart="small" {...props}>
            {hasFilters || logs?.data.length ? (
                <s-stack
                    paddingBlockEnd="small"
                    paddingInlineEnd="small"
                    direction="inline"
                    gap="small"
                    justifyContent="space-between"
                >
                    <s-paragraph>
                        {logs!.data.length} of {logs!.total} links
                    </s-paragraph>
                    <s-box>
                        <s-select
                            placeholder="Status"
                            icon="status"
                            onChange={(e) => handleFilters("type", e.currentTarget.value)}
                            disabled={loading}
                        >
                            {["PENDING", "FIXED"].map((filter) => (
                                <s-option value={filter} key={filter}>
                                    {filter}
                                </s-option>
                            ))}
                        </s-select>
                    </s-box>
                </s-stack>
            ) : null}
            {logs && logs.data.length > 0 ? (
                <s-table
                    loading={loading}
                    paginate
                    hasNextPage={logs!.hasNextPage || undefined}
                    hasPreviousPage={logs!.hasPreviousPage || undefined}
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                >
                    <s-table-header-row>
                        <s-table-header listSlot="primary">Hits</s-table-header>
                        <s-table-header listSlot="secondary">Path</s-table-header>
                        <s-table-header listSlot="secondary">Status</s-table-header>
                    </s-table-header-row>
                    <s-table-body>
                        {logs.data.map((log) => (
                            <s-table-row key={log.id}>
                                <s-table-cell>
                                    <s-badge tone="neutral">{log.hitCount}</s-badge>
                                </s-table-cell>

                                <s-table-cell>
                                    <s-text type="strong">{log.path}</s-text>
                                </s-table-cell>
                                <s-table-cell>
                                    <s-badge
                                        tone={log.status === "FIXED" ? "success" : "critical"}
                                    >
                                        {log.status}
                                    </s-badge>
                                </s-table-cell>
                            </s-table-row>
                        ))}
                    </s-table-body>
                </s-table>
            ) : (
                hasFilters && <s-text>No logs found.</s-text>
            )}
        </s-box>
    );
}
