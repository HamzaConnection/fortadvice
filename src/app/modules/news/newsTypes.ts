export type NewsItem = Readonly<{
    subject: string,
    imageUrl?: string,
    shortDescription?: string,
    publishDate: string
    permaLink: string
}>

export enum RoadmapItemType {
    UPCOMING = "UPCOMING",
    IMPLEMENTED = "IMPLEMENTED",
}

export enum RoadmapImplementationType {
    FEATURE = "FEATURE",
    BUGFIX = "BUGFIX",
}

type UpcomingRoadmapDetails = Readonly<{
    itemType: RoadmapItemType.UPCOMING
}>

type ImplementedRoadmapDetails = Readonly<{
    itemType: RoadmapItemType.IMPLEMENTED
    implementationType: RoadmapImplementationType
    implementationDate: string
}>

export type RoadmapDetails = UpcomingRoadmapDetails | ImplementedRoadmapDetails

export type RoadmapItem = NewsItem & Readonly<{
    roadmapDetails: RoadmapDetails
}>
