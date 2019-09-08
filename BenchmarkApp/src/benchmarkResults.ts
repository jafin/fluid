export class BenchmarkResult 
{
    public constructor(group:string, test:string, result:number) {
        this.group = group;
        this.test = test;
        this.result= result;
    }
    
    public group:string;
    public test:string;
    public result:number;
}