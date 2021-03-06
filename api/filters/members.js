/**
 * Created by ZhongyiTong on 11/21/15.
 */

"use strict";

class MembersFilter {

  static parseMembers(members) {
    for (let member of members) {
      member = MembersFilter.parseMember(member);
    }
    return members;
  };

  static parseMember(member) {
    if (member.access_level == 20) {
      member.role = 'student';
    } else if (member.access_level > 20) {
      member.role = 'teacher';
    } else {
      member.role = 'unknown';
    }

    delete member.access_level;

    member.item_type = 'member';
    return member;
  };

}

module.exports = MembersFilter;
