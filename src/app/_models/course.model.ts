
export class DescriptionCourse{
    heading:string;
    body:string;
}
export class CourseModel{
    id:number;
    category_id:number;
    title:string;
    media:any;
    video:any;
    media_path:any;
    video_path:any;
    media_id:number;
    video_id:number;
    view_count:number;
    regular_price:number;
    price:number;
    description : DescriptionCourse[] = [];
    instructor_id:number;
    published_at:number;
    is_active:number;
    certificate_available:number;
    is_free:number;
}