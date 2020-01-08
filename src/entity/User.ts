import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { Role } from "./Role";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ type: 'datetime' })
    birthdate: Date;

    @ManyToMany(type => Role, role => role.users, { eager: true })
    @JoinTable({ name: "user_has_role" })
    roles: Role[];

    hasRole(name: string) {
        return this.roles.some((role: Role) => {
            return role.name === name;
        });
    }

    hasPrivilege(operation: string) {
        return this.roles.some((role: Role) => {
            return role.hasPermission(operation);
        });
    }

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
