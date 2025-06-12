
export class ContentModel{
    chapter_id:number;
    media_id:number;
    title:string;
    video_type:string = 'upload';
    type:string;
    media:any;
    duration:number;
    is_forwardable:number;
    serial_number:number = 0;
    media_link:number;
    is_free:number = 0;
}

export class ChapterModel{
    course_id:number;
    title:string;
    serial_number:string;
    is_free:number;
    contents : ContentModel[] = [];
}