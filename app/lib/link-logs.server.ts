import { GhostLinkLog, LinkStatus, Prisma, Session } from "@prisma/client";
import db from "~/db.server";
import { ITEMS_PER_PAGE } from "./constants";

type GetLogSPrams = {
    type?: LinkStatus | "ALL";
    page?: number;
};

export type LogsResult = Awaited<ReturnType<typeof getLogs>>;

export async function getLogs(shop: Session["shop"], params?: GetLogSPrams) {
    try {
        const page = params?.page && params.page > 0 ? params.page : 1;
        const skip = (page - 1) * ITEMS_PER_PAGE;

        const where: Prisma.GhostLinkLogWhereInput = { shop };

        if (params?.type && params.type !== "ALL") {
            where.status = params.type;
        }
    
        let orderBy: Prisma.GhostLinkLogOrderByWithRelationInput = {
            createdAt: "desc",
        };

        const [data, total] = await Promise.all([
            db.ghostLinkLog.findMany({
                where,
                orderBy,
                skip,
                take: ITEMS_PER_PAGE,
            }),
            db.ghostLinkLog.count({ where }),
        ]);

        const hasNextPage = skip + data.length < total;
        const hasPreviousPage = page > 1;

        return {
            data,
            hasNextPage,
            hasPreviousPage,
            total,
            page,
        };
    } catch (error) {
        return {
            data: [],
            hasNextPage: false,
            hasPreviousPage: false,
            total: 0,
            page: 1,
        };
    }
}

type logHitPrams = {
    pathKey: string;
    fullUrl: string;
    referrer?: string;
};

export async function logHit(
    shop: Session["shop"],
    { pathKey, fullUrl, referrer }: logHitPrams,
) {
    try {
        return await db.ghostLinkLog.upsert({
            where: {
                shop_path: {
                    shop,
                    path: pathKey,
                },
            },
            update: {
                hitCount: { increment: 1 },
                url: fullUrl,
                referrer: referrer || null,
                updatedAt: new Date(),
            },
            create: {
                shop,
                path: pathKey,
                url: fullUrl,
                referrer: referrer || null,
                hitCount: 1,
                status: LinkStatus.PENDING,
            },
        });
    } catch (error) {
        return null;
    }
}

export async function updateLogStatus(
    id: GhostLinkLog["id"],
    status: LinkStatus,
) {
    try {
        return await db.ghostLinkLog.update({
            where: { id },
            data: { status },
        });
    } catch (error) {
        return null;
    }
}
