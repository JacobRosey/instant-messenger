export class User {
    public username: string;
    public hash: string;
    
    constructor(name:string, hash:string){
        this.username =  name;
        this.hash = hash;
    }
}