import { Model } from "../Model";
import { Field } from "../decorators/FIeld";
import { should } from "fuse-test-runner"
import { Stub } from "./Stub";
import { Validate } from "../decorators/Validate";
import { enableDefaultDecorators } from "../index";

const stub = new Stub();
enableDefaultDecorators();

class FooBarMin extends Model<FooBarMin> {
    @Field() @Validate({ min: 3 })
    public name: string;
}

class FooBarMax extends Model<FooBarMin> {
    @Field() @Validate({ max: 3 })
    public name: string;
}

class FooBarCustom extends Model<FooBarMin> {
    @Field()
    @Validate({
        fn: value => {
            if (value !== "foo") {
                throw new Error("Value should be foo only")
            }
        }
    })
    public name: string;
}

class FooBarRegExp extends Model<FooBarMin> {
    @Field() @Validate({ regExp: /\d{2}/ })
    public name: string;
}

class FooBarEmail extends Model<FooBarMin> {
    @Field() @Validate({ email: true })
    public name: string;
}
export class ValidationTest {
    after() {
        stub.clear();
    }
    async "Should validate min 3 (error)"() {
        const record = new FooBarMin({ name: "a" })
        await should().throwException(() => record.save())
    }

    async "Should validate min 4 (ok)"() {
        const record = new FooBarMin({ name: "abc" })
        return record.save()
    }

    async "Should validate max 3 (error)"() {
        const record = new FooBarMax({ name: "1234" })
        await should().throwException(() => record.save())
    }

    async "Should validate max 4 (ok)"() {
        const record = new FooBarMax({ name: "123" })
        await record.save()
    }

    async "Should make custom validation"() {
        const record = new FooBarCustom({ name: "1" })
        await should().throwException(() => record.save())
    }

    async "Should pass custom validation"() {
        const record = new FooBarCustom({ name: "foo" })
        await record.save();
    }

    async "Should validate RegExp (error)"() {
        const record = new FooBarRegExp({ name: "ab" })
        await should().throwException(() => record.save())
    }

    async "Should validate RegExp (ok)"() {
        const record = new FooBarRegExp({ name: "12" })
        return record.save()
    }

    async "Should validate email (error)"() {
        const record = new FooBarEmail({ name: "123123@" })
        await should().throwException(() => record.save())
    }

    async "Should validate email (ok)"() {
        const record = new FooBarEmail({ name: "foobar@gmail.com" })
        return record.save()
    }
}