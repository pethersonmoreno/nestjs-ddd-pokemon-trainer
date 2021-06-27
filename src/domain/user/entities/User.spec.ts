import { Email, IdentityUuid, Nickname, Password, Role } from '../valueObjects';
import User from './User';

const testIdentityUuid = IdentityUuid.create();
const testEmail = Email.create('someone@domain.com');
const testNickname = Nickname.create('Someone');
const testPassword = Password.create("x9&Kf4j33fjlsyg8");
const testRole = Role.createAdministrator();

describe('User', () => {
    it('should not create User directly', () => {
        expect(() => {
            new (User as any)()
        }).toThrow();
        expect(() => {
            new (User as any)({
                userId: testIdentityUuid,
                email: testEmail,
                nickname: testNickname,
                password: testPassword,
                role: testRole,
            })
        }).toThrow();
    });

    it('should not throw create User with create static method', () => {
        expect(() => {
            User.create({
                email: testEmail,
                nickname: testNickname,
                password: testPassword,
                role: testRole,
            })
        }).not.toThrow();
    });

    it('create method should create with same values used in parameters', () => {
        const user = User.create({
            email: testEmail,
            nickname: testNickname,
            password: testPassword,
            role: testRole,
        });
        expect(user.email).toBe(testEmail);
        expect(user.nickname).toBe(testNickname);
        expect(user.password).toBe(testPassword);
        expect(user.role).toBe(testRole);
    });

    it('should not change a value of User object', () => {
        const user = User.create({
            email: testEmail,
            nickname: testNickname,
            password: testPassword,
            role: testRole,
        });
        expect(() => {
            (user as any).userId = 'other value'
        }).toThrow();
        expect(() => {
            (user as any).email = 'other value'
        }).toThrow();
        expect(() => {
            (user as any).nickname = 'other value'
        }).toThrow();
        expect(() => {
            (user as any).password = 'other value'
        }).toThrow();
        expect(() => {
            (user as any).role = 'other value'
        }).toThrow();
    });

    it('should not be equal to null', () => {
        const user = User.create({
            email: testEmail,
            nickname: testNickname,
            password: testPassword,
            role: testRole,
        });
        expect(user.equals(null)).toBeFalsy();
    });

    it('should not be equal to undefined', () => {
        const user = User.create({
            email: testEmail,
            nickname: testNickname,
            password: testPassword,
            role: testRole,
        });
        expect(user.equals(undefined)).toBeFalsy();
    });

    it('should not be equal to a simple object with same ID', () => {
        const user = User.create({
            email: testEmail,
            nickname: testNickname,
            password: testPassword,
            role: testRole,
        });
        const userSimpleObj = { userId: user.userId };
        expect(user.equals(userSimpleObj as any)).toBeFalsy();
    });

    it('should not be equal to a different User ID', () => {
        const user1 = User.create({
            email: testEmail,
            nickname: testNickname,
            password: testPassword,
            role: testRole,
        });
        const user2 = User.createWithUserId({
            email: testEmail,
            nickname: testNickname,
            password: testPassword,
            role: testRole,
        });
        expect(user1.equals(user2)).toBeFalsy();
    });

    it('should be equal to same User', () => {
        const user1 = User.create({
            email: testEmail,
            nickname: testNickname,
            password: testPassword,
            role: testRole,
        });
        const user2 = User.createWithUserId({
            userId: user1.userId,
            email: testEmail,
            nickname: testNickname,
            password: testPassword,
            role: testRole,
        });
        expect(user1.equals(user2)).toBeTruthy();
    });
});
