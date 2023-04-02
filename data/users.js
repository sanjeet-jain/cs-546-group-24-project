import {usersCollection} from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';
import utils from "../utils/utils.js";
import bcrypt from "bcrypt";

/*
  UsersCollection {
    _id: ObjectId,
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    Disability:boolean,
    Dob:date,
    Consent:boolean
    taskIds: [ObjectId],
    reminderIds: [ObjectId],
    noteIds: [ObjectId],
    meetingIds: [ObjectId]
  }
*/
const pwRounds = 16;

const exportedMethods = {
    async create(
        first_name,
        last_name,
        email,
        password,
        Disability,
        Dob,
        Consent
    ){
       if (typeof first_name === "undefined" ||
        typeof last_name === "undefined" || 
        typeof email === "undefined" || 
        typeof password === "undefined" || 
        typeof Disability === "undefined" || 
        typeof Dob === "undefined" || 
        typeof Consent === "undefined"){
            throw new Error("Please fill in all fields");
        }
        //field validation
        utils.validateName(first_name, "First name");
        utils.validateName(last_name, "Last name");
        utils.validateEmail(email,"Email");
        utils.validatePassword(password,"Password");
        utils.validateBooleanInput(Disability,"Disability");
        utils.validateDate(Dob,"Date of Birth");
        utils.validateBooleanInput(Consent,"Consent");

        const users = await usersCollection();
        
        //checking if email is registered
        const exist_email = await users.findOne({email: email});
        if (exist_email) throw `Already a user registered with that email`;

        //password hashing

        const hashPW = await bcrypt.hash(password,pwRounds);

        
        const newUser = {
            _id: new ObjectId(),
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            email: email.toLowerCase(),
            password: hashPW,
            Disability: Disability,
            Dob: Dob,
            Consent: Consent,
            taskIds: [],
            reminderIds: [],
            noteIds: [],
            meetingIds: [],
        }
        const insertUser = await users.insertOne(newUser);
        if (insertUser.insertedCount === 0){
            throw `insertion of user failed`;
        }
        return {userInserted: true};
    },
    async getUser(id){
        if (!id) throw `No id supplied`;
        utils.checkObjectIdString(id);
        const users = await usersCollection();

        const user = await users.findOne({_id: new ObjectId(id)});
        return user;
    },
    async updateUser(
        id,
        {first_name,
        last_name,
        email,
        Disability,
        Dob}
    ){
        utils.checkObjectIdString(id);

        utils.validateName(first_name, "First name");
        utils.validateName(last_name, "Last name");
        utils.validateEmail(email,"Email");
        utils.validateBooleanInput(Disability,"Disability");
        utils.validateDate(Dob,"Date of Birth");

        const users = await usersCollection();
        const currUser = await this.getUser(id);

        let updatedUser = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: currUser.password,
            Disability: Disability,
            Dob: Dob,
            Consent: currUser.Consent,
            taskIds: currUser.taskIds,
            reminderIds: currUser.reminderIds,
            noteIds: currUser.noteIds,
            meetingIds: currUser.meetingIds
        }
        const updateInfo = await users.updateOne(
            {_id: new ObjectId(id)},
            {$set: updatedUser}
        );
        return updatedUser;
    },
    
    async changePassword(id, newPassword){
        utils.checkObjectIdString(id);
        utils.validatePassword(newPassword);

        newPassword = newPassword.trim();
        const hashPW = await bcrypt.hash(newPassword, pwRounds);

        let users = usersCollection();
        const updateInfo = await users.updateOne(
            {_id: new ObjectId(id)},
            { $set: {password: hashPW}}
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
            throw "Update failed";
          } else {
            return { updated: true };
          }
    },

    async loginUser(email,password){
        if (!email) throw Error(`No email provided`);
        if (!password) throw `No password provided`;
        const users = usersCollection();
        const currUser = await this.getUserByEmail(email);

        if (!currUser) throw `No account with that email`;

        utils.validatePassword(password);

        const hashPW = currUser.password;
        let validPassword = false;

        try{
            validPassword = await bcrypt.compare(password,hashPW);
        }catch(e){};

        if (validPassword){
            return currUser;
        }
        else{
            throw `Invalid password`;
        }
    },

    async getUserByEmail(email){
        //returns user object
        if (!email) throw `No id supplied`;
        utils.validateEmail(email);
        const users = await usersCollection();

        const user = await users.findOne({email: email});
        return user;
    }
}
export default exportedMethods;