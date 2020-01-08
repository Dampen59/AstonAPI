import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { IsUUID, IsAlpha } from "class-validator";
import { Role } from "./Role";

@Entity()
export class Permission {

    @IsUUID()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    operation: string;

    @Column()
    description: string;

    @ManyToMany(type => Role, role => role.permissions)
    roles: Role[];

}
