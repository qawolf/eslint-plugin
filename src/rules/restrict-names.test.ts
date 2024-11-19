import { valid, invalid } from "./tester";
import rule from "./restrict-names";

valid(rule, "can use find", "function find() {}");

invalid(rule, "can not use findOrCreate", "function findOrCreate() {}");
