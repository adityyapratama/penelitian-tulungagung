import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { PrismaClient, Prisma } from "../lib/generated/prisma";

dayjs.extend(utc);
dayjs.extend(timezone);

const prisma = new PrismaClient();



const userData: Prisma.UserCreateInput[] = [
  {
    username: "Aditya",
    email: "Aditya@gmail.com",
    password_hash:"$2a$10$cKpVeVrdMtUL/gwSv3ErQumTbXG/9Vf3gaJbTk3Cw5scSzkHO2J/O",
    role:"member",
    created_at:dayjs().toDate(),
    last_login:dayjs().toDate(),
    is_active:true
  },
  {
    username: "Helmi",
    email: "Helmi@gmail.com",
    password_hash:"$2a$10$cKpVeVrdMtUL/gwSv3ErQumTbXG/9Vf3gaJbTk3Cw5scSzkHO2J/O",
    role:"super_admin",
    created_at:dayjs().toDate(),
    last_login:dayjs().toDate(),
    is_active:true
  },
];

const CategoryArticleData: Prisma.KategoriArtikelCreateInput[] = [
  {
    nama_kategori:"Sejarah",
    created_at: dayjs().toDate(),
    deskripsi:"Lorem Ipsum Lorem Ipsum",
    User:{
      connect:{
        user_id:1
      }
    },
  },
   {
    nama_kategori:"Pendidikan",
    created_at: dayjs().toDate(),
    deskripsi:"Lorem Ipsum Lorem Ipsum",
    User:{
      connect:{
        user_id:1
      }
    },
  }
]

const ArticleData: Prisma.ArtikelCreateInput[] = [
  {
    judul: "Adit Makan Lontong Kupang",
    konten: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut tempus ipsum, eu iaculis mi. In lacus ligula, convallis mollis semper eu, malesuada vel arcu. Vestibulum porta, augue vitae bibendum scelerisque, neque enim consequat turpis, nec dictum turpis ipsum non libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tempus erat sit amet tincidunt blandit. Phasellus fermentum vitae dolor ut ultricies. Cras venenatis, enim vel auctor laoreet, lectus est vulputate dui, scelerisque rhoncus erat nibh eget ligula. Donec hendrerit mi ac mi ornare, in fringilla orci finibus. Etiam et lacus elementum lacus ullamcorper iaculis. Sed scelerisque maximus luctus. Etiam tempor arcu id finibus tristique. Pellentesque quis tristique augue. Maecenas suscipit eros et pretium convallis. Maecenas mauris elit, rutrum ac rhoncus in, tristique a ligula. Nunc fermentum fermentum mattis.

Aliquam consectetur ex nunc, in faucibus augue aliquet vitae. Cras nec erat felis. Nam sit amet ligula mattis, ultrices nibh vitae, luctus orci. In in enim iaculis, eleifend enim et, iaculis turpis. Praesent bibendum nec leo sit amet semper. Phasellus scelerisque ex vitae augue accumsan dignissim. Ut accumsan euismod urna. Pellentesque tincidunt libero neque, id malesuada felis accumsan vitae. Nam tellus massa, fringilla a neque non, tincidunt accumsan mauris. Ut eu dapibus diam, in blandit purus. Donec ligula mauris, faucibus nec urna id, volutpat viverra purus. Cras id nunc ut metus tincidunt convallis. Sed in imperdiet leo, in elementum enim. Nullam quis risus dolor. In lacinia nisl est, vel fermentum tellus posuere in.

Ut justo felis, semper ut laoreet vitae, scelerisque sed lorem. Donec hendrerit porta viverra. Nullam non aliquet urna. Nulla vulputate ut quam vel volutpat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce porttitor, ligula vel porttitor vestibulum, arcu diam sollicitudin ex, nec semper mi quam eu ligula. Mauris id ante enim. Etiam maximus pellentesque enim, eget vestibulum orci condimentum non. Aenean bibendum, massa nec euismod lobortis, mi velit mattis est, id viverra tellus ex vitae enim. Vestibulum ornare efficitur purus, quis hendrerit sapien porttitor et. Etiam lacinia vel turpis at suscipit. Donec nulla risus, faucibus eget rutrum non, ultricies sed dolor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

Nam eu lacinia turpis. Pellentesque iaculis blandit tempus. Sed pharetra arcu et lectus imperdiet accumsan sed posuere ante. Maecenas leo eros, mollis vitae accumsan id, faucibus eget nisl. Donec efficitur tellus eget libero dictum fermentum sit amet quis est. Phasellus euismod mollis enim, nec blandit diam cursus non. Sed scelerisque nisi eget condimentum aliquam. Cras sagittis leo rutrum, imperdiet tellus sit amet, vulputate quam. Morbi maximus felis sit amet tristique tincidunt. Nam ultricies commodo arcu nec vulputate. Pellentesque ornare suscipit efficitur. Nulla eu fermentum massa. Nam venenatis porttitor dui eu placerat.

Aliquam pharetra molestie nulla, ut dignissim nisl efficitur nec. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec eget blandit dui. Fusce condimentum ante id quam pretium, non aliquam nisi laoreet. Etiam in risus molestie, eleifend quam id, facilisis libero. Ut mattis erat non justo bibendum pulvinar. Sed id lacinia purus. Phasellus molestie nisl rutrum, hendrerit metus vitae, dapibus arcu. Quisque ut elit eros. Aliquam sodales nunc ut odio interdum, at tincidunt libero tempus. Sed in magna feugiat, varius mauris laoreet, sodales nisl.`,
    created_at: dayjs().toDate(),
    thumbnail: "https://images.unsplash.com/photo-1596526145339-44043b497063?q=80&w=2070&auto=format&fit=crop",
    KategoriArtikel:{
      connect:{
        KategoriArtikel_id:1
      }
    },User:{
      connect:{
        user_id:1
      }
    }
  },
  {
    judul: "Helmi Juga Ikut Makan",
    konten: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut tempus ipsum, eu iaculis mi. In lacus ligula, convallis mollis semper eu, malesuada vel arcu. Vestibulum porta, augue vitae bibendum scelerisque, neque enim consequat turpis, nec dictum turpis ipsum non libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tempus erat sit amet tincidunt blandit. Phasellus fermentum vitae dolor ut ultricies. Cras venenatis, enim vel auctor laoreet, lectus est vulputate dui, scelerisque rhoncus erat nibh eget ligula. Donec hendrerit mi ac mi ornare, in fringilla orci finibus. Etiam et lacus elementum lacus ullamcorper iaculis. Sed scelerisque maximus luctus. Etiam tempor arcu id finibus tristique. Pellentesque quis tristique augue. Maecenas suscipit eros et pretium convallis. Maecenas mauris elit, rutrum ac rhoncus in, tristique a ligula. Nunc fermentum fermentum mattis.

Aliquam consectetur ex nunc, in faucibus augue aliquet vitae. Cras nec erat felis. Nam sit amet ligula mattis, ultrices nibh vitae, luctus orci. In in enim iaculis, eleifend enim et, iaculis turpis. Praesent bibendum nec leo sit amet semper. Phasellus scelerisque ex vitae augue accumsan dignissim. Ut accumsan euismod urna. Pellentesque tincidunt libero neque, id malesuada felis accumsan vitae. Nam tellus massa, fringilla a neque non, tincidunt accumsan mauris. Ut eu dapibus diam, in blandit purus. Donec ligula mauris, faucibus nec urna id, volutpat viverra purus. Cras id nunc ut metus tincidunt convallis. Sed in imperdiet leo, in elementum enim. Nullam quis risus dolor. In lacinia nisl est, vel fermentum tellus posuere in.

Ut justo felis, semper ut laoreet vitae, scelerisque sed lorem. Donec hendrerit porta viverra. Nullam non aliquet urna. Nulla vulputate ut quam vel volutpat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce porttitor, ligula vel porttitor vestibulum, arcu diam sollicitudin ex, nec semper mi quam eu ligula. Mauris id ante enim. Etiam maximus pellentesque enim, eget vestibulum orci condimentum non. Aenean bibendum, massa nec euismod lobortis, mi velit mattis est, id viverra tellus ex vitae enim. Vestibulum ornare efficitur purus, quis hendrerit sapien porttitor et. Etiam lacinia vel turpis at suscipit. Donec nulla risus, faucibus eget rutrum non, ultricies sed dolor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

Nam eu lacinia turpis. Pellentesque iaculis blandit tempus. Sed pharetra arcu et lectus imperdiet accumsan sed posuere ante. Maecenas leo eros, mollis vitae accumsan id, faucibus eget nisl. Donec efficitur tellus eget libero dictum fermentum sit amet quis est. Phasellus euismod mollis enim, nec blandit diam cursus non. Sed scelerisque nisi eget condimentum aliquam. Cras sagittis leo rutrum, imperdiet tellus sit amet, vulputate quam. Morbi maximus felis sit amet tristique tincidunt. Nam ultricies commodo arcu nec vulputate. Pellentesque ornare suscipit efficitur. Nulla eu fermentum massa. Nam venenatis porttitor dui eu placerat.

Aliquam pharetra molestie nulla, ut dignissim nisl efficitur nec. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec eget blandit dui. Fusce condimentum ante id quam pretium, non aliquam nisi laoreet. Etiam in risus molestie, eleifend quam id, facilisis libero. Ut mattis erat non justo bibendum pulvinar. Sed id lacinia purus. Phasellus molestie nisl rutrum, hendrerit metus vitae, dapibus arcu. Quisque ut elit eros. Aliquam sodales nunc ut odio interdum, at tincidunt libero tempus. Sed in magna feugiat, varius mauris laoreet, sodales nisl.`,
    created_at: dayjs().toDate(),
    thumbnail: "https://images.unsplash.com/photo-1596526145339-44043b497063?q=80&w=2070&auto=format&fit=crop",
    KategoriArtikel:{
      connect:{
        KategoriArtikel_id:1
      }
    },User:{
      connect:{
        user_id:1
      }
    }
  },
  {
    judul: "Mufi Makan Lontong Kupang",
    konten: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut tempus ipsum, eu iaculis mi. In lacus ligula, convallis mollis semper eu, malesuada vel arcu. Vestibulum porta, augue vitae bibendum scelerisque, neque enim consequat turpis, nec dictum turpis ipsum non libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tempus erat sit amet tincidunt blandit. Phasellus fermentum vitae dolor ut ultricies. Cras venenatis, enim vel auctor laoreet, lectus est vulputate dui, scelerisque rhoncus erat nibh eget ligula. Donec hendrerit mi ac mi ornare, in fringilla orci finibus. Etiam et lacus elementum lacus ullamcorper iaculis. Sed scelerisque maximus luctus. Etiam tempor arcu id finibus tristique. Pellentesque quis tristique augue. Maecenas suscipit eros et pretium convallis. Maecenas mauris elit, rutrum ac rhoncus in, tristique a ligula. Nunc fermentum fermentum mattis.

Aliquam consectetur ex nunc, in faucibus augue aliquet vitae. Cras nec erat felis. Nam sit amet ligula mattis, ultrices nibh vitae, luctus orci. In in enim iaculis, eleifend enim et, iaculis turpis. Praesent bibendum nec leo sit amet semper. Phasellus scelerisque ex vitae augue accumsan dignissim. Ut accumsan euismod urna. Pellentesque tincidunt libero neque, id malesuada felis accumsan vitae. Nam tellus massa, fringilla a neque non, tincidunt accumsan mauris. Ut eu dapibus diam, in blandit purus. Donec ligula mauris, faucibus nec urna id, volutpat viverra purus. Cras id nunc ut metus tincidunt convallis. Sed in imperdiet leo, in elementum enim. Nullam quis risus dolor. In lacinia nisl est, vel fermentum tellus posuere in.

Ut justo felis, semper ut laoreet vitae, scelerisque sed lorem. Donec hendrerit porta viverra. Nullam non aliquet urna. Nulla vulputate ut quam vel volutpat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce porttitor, ligula vel porttitor vestibulum, arcu diam sollicitudin ex, nec semper mi quam eu ligula. Mauris id ante enim. Etiam maximus pellentesque enim, eget vestibulum orci condimentum non. Aenean bibendum, massa nec euismod lobortis, mi velit mattis est, id viverra tellus ex vitae enim. Vestibulum ornare efficitur purus, quis hendrerit sapien porttitor et. Etiam lacinia vel turpis at suscipit. Donec nulla risus, faucibus eget rutrum non, ultricies sed dolor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

Nam eu lacinia turpis. Pellentesque iaculis blandit tempus. Sed pharetra arcu et lectus imperdiet accumsan sed posuere ante. Maecenas leo eros, mollis vitae accumsan id, faucibus eget nisl. Donec efficitur tellus eget libero dictum fermentum sit amet quis est. Phasellus euismod mollis enim, nec blandit diam cursus non. Sed scelerisque nisi eget condimentum aliquam. Cras sagittis leo rutrum, imperdiet tellus sit amet, vulputate quam. Morbi maximus felis sit amet tristique tincidunt. Nam ultricies commodo arcu nec vulputate. Pellentesque ornare suscipit efficitur. Nulla eu fermentum massa. Nam venenatis porttitor dui eu placerat.

Aliquam pharetra molestie nulla, ut dignissim nisl efficitur nec. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec eget blandit dui. Fusce condimentum ante id quam pretium, non aliquam nisi laoreet. Etiam in risus molestie, eleifend quam id, facilisis libero. Ut mattis erat non justo bibendum pulvinar. Sed id lacinia purus. Phasellus molestie nisl rutrum, hendrerit metus vitae, dapibus arcu. Quisque ut elit eros. Aliquam sodales nunc ut odio interdum, at tincidunt libero tempus. Sed in magna feugiat, varius mauris laoreet, sodales nisl.`,
    created_at: dayjs().toDate(),
    thumbnail: "https://images.unsplash.com/photo-1596526145339-44043b497063?q=80&w=2070&auto=format&fit=crop",
    KategoriArtikel:{
      connect:{
        KategoriArtikel_id:1
      }
    },User:{
      connect:{
        user_id:1
      }
    }
  },
  
]



export async function main() {
  for (const u of userData) {
    await prisma.user.upsert({
    where: { username: u.username },
    update: {},          // kalau sudah ada, biarkan
    create: u,           // kalau belum ada, buat baru
    })
  }
  for (const c of CategoryArticleData){
    await prisma.kategoriArtikel.create({data:c})
  }
  for (const a of ArticleData){
    await prisma.artikel.create({data:a})
  }
}

main();