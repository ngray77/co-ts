export class Model {
  private records: Record[] = [];
  
  constructor(public readonly name: string) {}
  
  get Records(): Record[] {
    return this.records;
  }
  
  prettyConsole(): void {
    const header = `| ${"Body".padEnd(50)} | ${"Id".padStart(4)} | ${"PId".padStart(4)} | ${"Dirty".padEnd(5)}`;
    console.log(`${this.name.padEnd(header.length, '-')}`);
    console.log(header);
    this.records.forEach(r => 
      console.log(`| ${r.Body.padEnd(50)} | ${r.Id?.toString().padStart(4) || ""} | ${r.ParentId?.toString().padStart(4) || ""} | ${r.IsDirty.toString().padEnd(5)}`)
    );
  }
}

export class Record {
  private _id: number | null = null;
  private _parentId: number | null = null;
  private _body: string = "";
  
  private readonly _dirtyFields: Set<string> = new Set();
  
  get Id(): number | null {
    return this._id;
  }
  
  set Id(value: number | null) {
    if (this._id !== value) {
      this._id = value;
      this._dirtyFields.add("Id");
    }
  }
  
  get ParentId(): number | null {
    return this._parentId;
  }
  
  set ParentId(value: number | null) {
    if (this._parentId !== value) {
      this._parentId = value;
      this._dirtyFields.add("ParentId");
    }
  }
  
  get Body(): string {
    return this._body;
  }
  
  set Body(value: string) {
    if (this._body !== value) {
      this._body = value;
      this._dirtyFields.add("Body");
    }
  }
  
  get IsDirty(): boolean {
    return this._dirtyFields.size > 0;
  }
  
  resetDirty(): void {
    this._dirtyFields.clear();
  }
}
